// js file to play around with stuffs.


const test_data = `[
    {
        "author": "Discordian",
        "content": "Awesome, thanks!"
    },
    {
        "author": "Matrix Bridge",
        "content": "@momack2:matrix.org joined the room on Matrix."
    }
],`


const encoded = Buffer.from(test_data).toString("base64");

// print which version is longer
console.log(`${test_data.length} vs ${encoded.length}`);