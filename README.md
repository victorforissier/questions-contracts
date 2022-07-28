# Narcissa Hardhat Repository

Everything blockchain.

Organization:

```
├── artifacts
│   └── compiled solidity contracts
├── contracts
│   └── solidity contract source
├── lib
│   └── helper stuff
├── scripts/
│   └── useful scripts (deployment etc...)
├── tasks/
│   └── useful tasks
└── test/
    └── unit & integration tests for smart contracts
```



## Useful commands:
Install hardhat ```yarn add hardhat```

Run script in specific network: ```npx hardhat run scripts/deployNFT.js --network ropsten```

hardhat help: ```npx hardhat help```

compile scripts: ```npx hardhat compile```

## More Useful commands, added by Barb (2022-07-28)
1.) Start a new npm project
    npm init -y 

2.) Install hardhat
    npm install -D hardhat

3.) Create Hardhat project
    npx hardhat

    --> Select 'create an empty hardhat.config.js

4.) Install some dependencies
    npm install -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai 

5.) Edit hardhat.config.js to include dependencies

6.) mkdir contracts
    cd contracts
    create solidity code

7.) Compile
    npx hardhat compile

8.) Artifacts from compiling will be in 
    ../artifacts/

9.) Write tests in Javascript
    test/Token.js

10.) Run the tests (from the root of the hardhat directory)
     npx hardhat test

11.) Make a deploy script
     mkdir scripts
     vi deploy.js

12.) Install dotenv
     npm install dotenv

13.) Create a .env file with URLs to the various networks
     and your private key

13.1) nvm use v16.14.2 

14.) Run the deploy script targeted at the Ropsten test network
     npx hardhat run scripts/deploy.js --network ropsten 

15.) npm install @nomiclabs/hardhat-etherscan 

16.) Check https://ropsten.etherscan.io/address/<address>

17.) Once the deploy shows up on etherscan, then run the hardhat verify:
     npx hardhat verify <address> --network ropsten

