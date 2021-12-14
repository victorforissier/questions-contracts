async function main() {
    // import { ethers } from "ethers";
    // const { ethers } = require("ethers");
    const { ethers } = require("hardhat");

    // get account from private key
    const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
    const account = new ethers.Wallet(ROPSTEN_PRIVATE_KEY).connect(ethers.getDefaultProvider('ropsten'));

    console.log("account: ", account.address);
    console.log("Account balance: " + ethers.utils.formatEther(await account.getBalance()));

    // Grab the contract factory 
    const NarcissaNFQcontract = await ethers.getContractFactory("NarcissaNFQ");
 
    // Start deployment, returning a promise that resolves to a contract object
    const NarcissaNFQ = await NarcissaNFQcontract.deploy(); // Instance of the contract 
    console.log("Contract deployed to address:", NarcissaNFQ.address);

    let balance2 = await account.getBalance();
    console.log("Account balance: " + ethers.utils.formatEther(balance2));
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });