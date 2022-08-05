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
