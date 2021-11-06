const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bounties functions", function () {
	let owner;
	let contributor;
	let answerer;
	let bounties;

	beforeEach(async function () {
		// Get the ContractFactory and Signers here.
		const Bounties = await ethers.getContractFactory("ClassicBounties");
		[owner, contributor, answerer] = await ethers.getSigners();
		bounties = await Bounties.deploy();
	});

	describe("#contribute", function () {
		beforeEach(async function () {
			await bounties
				.connect(contributor)
				.issueBounty(contributor.address, "questionId", 0);
			expect(await bounties.numBounties()).to.equal(1);
		});

		it("Should contribute to bounty", async function () {
			const _amount = ethers.utils.parseEther("1");
			await bounties
				.connect(contributor)
				.contribute(contributor.address, 0, _amount, {
					value: _amount,
				});
			const bounty = await bounties.getBounty(0);
			expect(bounty.contributions).to.have.lengthOf(1);
			expect(bounty.contributions[0].amount).to.equal(_amount);
		});
	});

	describe("#issueAndContribute", function () {
		it("Should create bounty", async function () {
			const _amount = ethers.utils.parseEther("1");
			await bounties
				.connect(contributor)
				.issueBountyAndContribute(
					contributor.address,
					"questionId",
					0,
					_amount,
					{
						value: _amount,
					}
				);
			expect(await bounties.numBounties()).to.equal(1);
		});
	});
});
