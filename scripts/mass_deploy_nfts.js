// import exports from "./mintNFT";
const { mint_an_nft} = require("./mintNFT");

var qa_threads = require('./qa_threads.json');
const qa_threads_length = Object.keys(qa_threads).length;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    for (var i = 0; i < 10 ; i++) {
        const data = qa_threads[i];
        // data to string
        var data_string = JSON.stringify(data);
        console.log(typeof data_string);
        console.log(data_string);
        console.log("in loop " + i);
        mint_an_nft(data_string);
        await sleep(5000);  // need this to let transaction pass through (nonces and stuff)
    }
}

main();

