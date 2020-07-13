const request = require('request');
const { model } = require('./models/User');
require("dotenv/config");

function getFaceId(imageUri, callback) {

  var options = {
    'method': 'POST',
    'url': process.env.FACE_API_HOST + process.env.FACE_API_PATH_DETECT,
    'headers': {
      'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY,
      'Content-Type': 'application/octet-stream'
    },
    body: Buffer.from(imageUri.split(",")[1], 'base64')
  };
  request(options, function (error, response) {
    if(response.statusCode === 200){
      callback(response.body);
    }
    if (error) throw new Error(error);
    // console.log(JSON.parse(response.body)[0].faceId)
  });

}

module.exports = {
  getFaceId: getFaceId
}
