const { ethers } = require("ethers");
require("dotenv").config({path : `/home/barb/.blockchainEnv`});

const privateKey = process.env.BRAVE_METAMASK
const provider = new ethers.providers.JsonRpcProvider(process.env.ROPSTEN)
const signer   = new ethers.Wallet(privateKey, provider)
// const signer   = signer.provider.getSigner(process.env.BRAVE_METAMASK);

// https://stackoverflow.com/questions/71755563/what-is-the-difference-between-a-signer-and-a-jsonrpcsigner


const BOUNTIES_ABI = [
    "function issueBountyAndContribute(address payable _sender,string _questionId, uint256 _depositAmount, string gas)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function getTotalSupply() view returns (uint)",

    "event Transfer(address indexed from, address indexed to, uint amount)"
];

const main = async () => {

    // The Contract object
    const bountyAddress = '0x67C8901acFA8a43c851c2400FcF69C0243F806D1'
    const readContract  = new ethers.Contract(bountyAddress, BOUNTIES_ABI, provider);
    const writeContract = new ethers.Contract(bountyAddress, BOUNTIES_ABI, signer);

    readContract.getTotalSupply().then((result) => {
          console.log("TotalSupply: " , result)
    })

    const signerAddr = signer.address;
    console.log(`WalletAddress: ${signerAddr}`);

    // console.log(await provider.getCode(bountyAddress));

    const depositAmount = ethers.utils.parseEther('.001');
    try {
          gas = await signer.getGasPrice()
          console.log("Gas Price: " , gas.toString())

          const _amount = ethers.utils.parseEther((1 / 10000).toString());

          const tx = await writeContract.issueBountyAndContribute(signer.address, "ThisIsATest", _amount, [], 
                           { gasLimit: 54000}); 

          console.log(tx);

          const numBounties = await bountiesContract.numBounties();
          console.log(`NumBounties: ${numBounties}`);

    } catch (e) {
         // alert("Error: " + e.reason || e.code);
         console.log(e.reason);
         console.log(e.code);
    }


}

main()

