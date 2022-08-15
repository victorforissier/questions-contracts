/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({path : `/home/barb/.blockchainEnv`});

module.exports = {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
     ropsten: {
        url: process.env.ROPSTEN,
        accounts: [ process.env.BRAVE_METAMASK ]
     },
     polygon: {
        url: process.env.POLYGON,
        accounts: [ process.env.BRAVE_METAMASK ]
     },
     rinkeby: {
        url: process.env.RINKEBY,
        accounts: [ process.env.BRAVE_METAMASK ]
     },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

/*
	solidity: "0.8.4",
	networks: {
		ropsten: {
			url: `https://eth-ropsten.alchemyapi.io/v2/OC1AmrV2htsmkHSvNf4ZN4CAXX0w51O2`,
			accounts: [
				`0x8b1c2f2ed76b3c7155539354810a450c2fcadca9dd4cb5a1818e6dd54d5a322f`,
			],
			// gas: 2100000,
			// gasPrice: 40000000000,
		},
		matic: {
			url: "https://matic-mainnet.chainstacklabs.com", //"https://rpc-mumbai.maticvigil.com",
			accounts: [process.env.PRIVATE_KEY],
		},
	},
*/
