async function mint_an_nft( metadata) {
    const { ethers } = require("hardhat");
    const accounts = await hre.ethers.getSigners();

    const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
    const ROPSTEN_NFT_CONTRACT_ADDRESS = process.env.ROPSTEN_NFT_CONTRACT_ADDRESS;
  
    // contract is deployed 
    const myContract = await hre.ethers.getContractAt("MyNFT", ROPSTEN_NFT_CONTRACT_ADDRESS);
    const artifact = await hre.artifacts.readArtifact("MyNFT");
    const abi = artifact.abi;

    const NFT_contract = new ethers.Contract(ROPSTEN_NFT_CONTRACT_ADDRESS, abi, hre.ethers.getSigners()[0]);
    console.log("MyNFT contract at: ", myContract.address);

    // const metadata = "victor is dumb";
    const recipient_address = process.env.PUBLIC_ADDRESS_HUGO;

    console.log("recipient_address", recipient_address);
    const transaction = await myContract.mintNFT(recipient_address, metadata); // Minting the token
    const tx = await transaction.wait() // Waiting for the token to be minted
    // console.log("tx", tx);

    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber(); // Getting the tokenID

    const tokenURI = await myContract.tokenURI(tokenId) // Using the tokenURI from ERC721 to retrieve de metadata
    
    // import chai
    // const { expect } = require("chai");
    // var expect = chai.expect;
    // expect(tokenURI).to.be.equal(metadata); // Comparing and testing
    console.log("tokenURI ", tokenURI);
}

// python's equivalent to if __name__ == '__main__':
if (require.main === module) {
  mint_an_nft("victor is dumb")
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
}

// export function
module.exports = {
  mint_an_nft
}