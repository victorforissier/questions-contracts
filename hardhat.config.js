require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// /////////////////////////////////////////////////////////////////////////////
// Tasks
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// task ("deploy", "Deploys the contract", async (taskArgs, hre) => {
// 	const accounts = await hre.ethers.getSigners();
// 	const deployer = accounts[0];

// 	const factory = await hre.ethers.getContractFactory("HardhatERC20");
// 	const contract = await factory.deploy();
	
// 	await contract.deployed();
// 	console.log(contract.address);
// });


// /////////////////////////////////////////////////////////////////////////////
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// Exported stuffs
module.exports = {
	solidity: "0.8.4",
	networks: {
		ropsten: {
			url: `https://eth-ropsten.alchemyapi.io/v2/OC1AmrV2htsmkHSvNf4ZN4CAXX0w51O2`,
			accounts: [`0x8b1c2f2ed76b3c7155539354810a450c2fcadca9dd4cb5a1818e6dd54d5a322f`],
			// gas: 2100000,
			// gasPrice: 40000000000,
		},
		matic: {
			url: "https://matic-mainnet.chainstacklabs.com", //"https://rpc-mumbai.maticvigil.com",
			accounts: [process.env.PRIVATE_KEY],
		},
	},
};
