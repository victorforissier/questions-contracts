// sample code to access NFTs deployed on chain

async function getAllNFQs() {
    const ROPSTEN_NFT_CONTRACT_ADDRESS = process.env.ROPSTEN_NFT_CONTRACT_ADDRESS;

    const { ethers } = require("hardhat");
    const accounts = await hre.ethers.getSigners();

    const NarcissaNFQcontract = await hre.ethers.getContractAt(
        "NarcissaNFQ",
        ROPSTEN_NFT_CONTRACT_ADDRESS
    );
    const artifact = await hre.artifacts.readArtifact("NarcissaNFQ");
    const abi = artifact.abi;

    // get all NFTs from contract
    const n_tokens = 20;
    var metadata = [];
    for (var i = 1; i < n_tokens; i++) {
        const token_id = i;
        console.log("retrieved token_id: ", token_id);
        const tokenURI = await NarcissaNFQcontract.tokenURI(token_id);
        
        // decode data
        const data_part = tokenURI.split(",")[1];
        const decoded_data = Buffer.from(data_part, "base64").toString("utf8");
        metadata.push(decoded_data);
    }
    console.log("metadata: ", metadata);
}

getAllNFQs()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
