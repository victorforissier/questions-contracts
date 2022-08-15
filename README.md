# Narcissa Hardhat Repository

Everything blockchain.

Organization:

```
├── artifacts
│   └── compiled solidity contracts
├── contracts
│   └── solidity contract source
├── scripts/
│   └── useful scripts (deployment etc...)
└── test/
    └── unit & integration tests for smart contracts
```

## Getting Started (2022-08-05)

0.) Make sure you are using a relatively current verion of 
    node.  I do ```nvm use 16.14.2```

1.) Since there is a package-lock.json checked into the repo,
    ```npm install```  should install all of the dependencies locally

2.) Install this separately
    ```npm install @nomiclabs/hardhat-etherscan``` 

3.) Update hardhat.config.js with the path and filename
    to your ENV file.  An example shell is in envExample.txt
    NOTE:  You won't be able to compile until you have 
    appropriate definitions in your .env file

4.) Compile
    ```npx hardhat compile```

5.) Create a .env file with URLs to the various networks
    and your private key

4.) Edit hardhat.config.js to point to your env file

5.) Install some dependencies
    ```npm install -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai```

6.) Test
    ```npx hardhat test```

7.) Deploy
     ```npx hardhat run scripts/deploy.js --network ropsten``` 

## Useful commands -- From the original README. Left here for completeness.

Install hardhat ```yarn add hardhat```

Run script in specific network: `npx hardhat run scripts/deployNFT.js --network ropsten`

hardhat help: `npx hardhat help`

compile scripts: `npx hardhat compile`

## For more completeness, if you were starting with an environment that didn't already have a package-lock.json... 

1.) Start a new npm project
`npm init -y`

2.) Install hardhat
`npm install -D hardhat`

3.) Create Hardhat project
`npx hardhat`

    --> ``` Select 'create an empty hardhat.config.js ```

4.) Install some dependencies
`npm install -D @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai`

5.) Edit hardhat.config.js to include dependencies

6.) mkdir contracts
    cd contracts
    create solidity code
    
7.) Artifacts from compiling will be in 
    ../artifacts/

8.) Write tests in Javascript
    ```test/test.js```

9.) Run the tests (from the root of the hardhat directory)
     ```npx hardhat test```

10.) Make a deploy script
     ```mkdir scripts```
     ```vi deploy.js```

11.) Install dotenv
     ```npm install dotenv```

12.) Run the deploy script targeted at the Ropsten test network
     ```npx hardhat run scripts/deploy.js --network ropsten``` 

13.) ```npm install @nomiclabs/hardhat-etherscan``` 

14.) Check ```https://ropsten.etherscan.io/address/<address>```

15.) Once the deploy shows up on etherscan, then run the hardhat verify:
    ```npx hardhat verify <address> --network ropsten```
