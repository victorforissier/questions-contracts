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