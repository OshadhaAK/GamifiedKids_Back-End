const fs = require('fs');
require("dotenv/config");

let imageUrl= process.env.img.split(",")[1];

let buf = Buffer.from(imageUrl, 'base64');
console.log(buf);
fs.writeFileSync('uploads/image.png', buf);