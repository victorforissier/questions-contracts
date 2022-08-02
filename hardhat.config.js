/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({path : `/home/barb/.blockchainEnv`});

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.0", },
      { version: "0.8.4", },
      { version: "0.6.7", }
    ]
  },
  networks: {
     ropsten: {
        url: process.env.ROPSTEN,
        accounts: [ process.env.BRAVE_METAMASK ]
     },
     polygon: {
        url: process.env.POLYGON,
        accounts: [ process.env.BRAVE_METAMASK ]
     }
  },
  namedAccounts: {
      account0: 0
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
