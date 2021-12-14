async function mint_an_nfq(metadata) {
  const { ethers } = require("hardhat");
  const accounts = await hre.ethers.getSigners();

  const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
  const ROPSTEN_NFT_CONTRACT_ADDRESS = process.env.ROPSTEN_NFT_CONTRACT_ADDRESS;

  // contract is deployed
  const myContract = await hre.ethers.getContractAt(
    "NarcissaNFQ",
    ROPSTEN_NFT_CONTRACT_ADDRESS
  );
  const artifact = await hre.artifacts.readArtifact("NarcissaNFQ");
  const abi = artifact.abi;
  const NFT_contract = new ethers.Contract(
    ROPSTEN_NFT_CONTRACT_ADDRESS,
    abi,
    hre.ethers.getSigners()[0]
  );
  console.log("NarcissaNFQ contract at: ", myContract.address);

  const recipient_address = process.env.PUBLIC_ADDRESS_HUGO;
  console.log("recipient_address", recipient_address);

  // encode json string as Data URL to put in the URI field of erc721 token
  // ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
  // data:[text/plain;charset=UTF-8][;base64],<data>
  const data_url =
    "data:text/plain;charset=UTF-8;base64," +
    Buffer.from(metadata).toString("base64");
  console.log("metadata", metadata);
  const transaction = await myContract.mintNFT(recipient_address, data_url); // Minting the token
  const tx = await transaction.wait(); // Waiting for the token to be minted
  // console.log("tx", tx);

  const event = tx.events[0];
  const value = event.args[2];
  const tokenId = value.toNumber(); // Getting the tokenID

  const tokenURI = await myContract.tokenURI(tokenId); // Using the tokenURI from ERC721 to retrieve de metadata

  // import chai
  // const { expect } = require("chai");
  // var expect = chai.expect;
  // expect(tokenURI).to.be.equal(metadata); // Comparing and testing
  console.log("tokenURI ", tokenURI);
  console.log("tokenId ", tokenId);
  // decode tokenURI from base64 to string
  const data_part = tokenURI.split(",")[1];
  const decoded_data = Buffer.from(data_part, "base64").toString("utf8");
  console.log("decoded data ", decoded_data);
}

// python's equivalent to if __name__ == '__main__':
if (require.main === module) {
  const test_data = `[
    {
        "author": "Discordian",
        "content": "What is 1 + 1?",
    },
    {
        "author": "Obama",
        "content": "It's actually 2.",
    },
    {
        "author": "Discordian",
        "content": "Thanks, Obama.",
    }
],`;
  mint_an_nfq(test_data)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// export function
module.exports = {
  mint_an_nfq,
};
