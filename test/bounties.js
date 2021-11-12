const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bounties functions", function() {
	let owner;
	let contributor;
	let answerer;
	let bounties;

	beforeEach(async function() {
		// Get the ContractFactory and Signers here.
		const Bounties = await ethers.getContractFactory("ClassicBounties");
		[owner, contributor, answerer] = await ethers.getSigners();
		bounties = await Bounties.deploy();
	});

	describe("#contribute", function() {
		beforeEach(async function() {
			const _amount = ethers.utils.parseEther("1");
			await bounties
				.connect(contributor)
				.issueBountyAndContribute(contributor.address, "questionId", _amount, {
					value: _amount,
				});
			expect(await bounties.numBounties()).to.equal(1);
		});

		it("Should contribute to bounty", async function() {
			const _amount = ethers.utils.parseEther("1");
			await bounties
				.connect(contributor)
				.contribute(contributor.address, 0, _amount, {
					value: _amount,
				});
			const bounty = await bounties.getBounty(0);
			expect(bounty.contributions).to.have.lengthOf(2);
			expect(bounty.contributions[1].amount).to.equal(_amount);
		});
	});

	describe("#issueAndContribute", function() {
		it("Should create bounty", async function() {
			const _amount = ethers.utils.parseEther((1 / 10000).toString());
			await bounties
				.connect(contributor)
				.issueBountyAndContribute(contributor.address, "questionId", _amount, {
					value: _amount,
				});
			expect(await bounties.numBounties()).to.equal(1);
		});
	});

	describe("#fulfill", function() {
		beforeEach(async function() {
			const _amount = ethers.utils.parseEther("1");
			await bounties
				.connect(contributor)
				.issueBountyAndContribute(contributor.address, "questionId", _amount, {
					value: _amount,
				});
		});

		const test = async () => {
			await bounties
				.connect(answerer)
				.answerBounty(answerer.address, 0, "answerId");
			return await bounties.getBounty(0);
		};
		it("Should create a bounty", async function() {
			const bounty = await test();
			expect(bounty.fulfillments).to.have.lengthOf(1);
		});

		it("Fulfillment should have a timestamp", async function() {
			const bounty = await test();
			expect(bounty.fulfillments[0].timestamp.toNumber()).to.be.a("number");
		});
	});

	describe("#transfer", function() {
		const _amount = ethers.utils.parseEther("100");
		beforeEach(async function() {
			await bounties
				.connect(contributor)
				.issueBountyAndContribute(contributor.address, 0, _amount, {
					value: _amount,
				});
			await bounties
				.connect(answerer)
				.answerBounty(answerer.address, 0, "answerId");
		});
		it("Balance should be 100 eth", async function() {
			const bounty = await bounties.getBounty(0);
			expect(bounty.balance).to.equal(_amount);
		});
		it("Should have empty bounty balance", async function() {
			await bounties.connect(owner).acceptAnswer(owner.address, 0, 0, _amount);
			const bounty = await bounties.getBounty(0);
			expect(bounty.balance).to.equal(ethers.utils.parseEther("0"));
		});
		it("Should have different owner balance", async function() {
			const prevBalance = await ethers.provider.getBalance(owner.address);
			await bounties.connect(owner).acceptAnswer(owner.address, 0, 0, _amount);
			const nextBalance = await ethers.provider.getBalance(owner.address);
			expect(nextBalance == prevBalance).to.be.false;
		});
		it("Should have different submitter balance", async function() {
			const prevBalance = await ethers.provider.getBalance(answerer.address);
			await bounties.connect(owner).acceptAnswer(owner.address, 0, 0, _amount);
			const nextBalance = await ethers.provider.getBalance(answerer.address);
			expect(nextBalance == prevBalance).to.be.false;
		});
	});
});
