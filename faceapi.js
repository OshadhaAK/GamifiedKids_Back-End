const request = require('request');
require("dotenv/config");



var options = {
    'method': 'POST',
    'url': process.env.FACE_API_HOST + process.env.FACE_API_PATH_DETECT,
    'headers': {
        'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY,
        'Content-Type': 'application/octet-stream'
    },
    body: Buffer.from(process.env.img.split(",")[1], 'base64')
};

request(options, async (error, response) => {

    if (error) throw new Error(error);
    console.log(JSON.parse(response.body))
    console.log(JSON.parse(response.body)[0].faceId)
});






