const express = require("express");
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require("dotenv/config");
const fs = require('fs');
const http = require('http');
const https = require('https');
var request = require('request');

function getFaceId(imageUri, callBack) {
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
        var statusCode = response.statusCode;
        var finalData = JSON.parse(response.body.toString());
        return callBack(finalData);
        // console.log(JSON.parse(response.body)[0].faceId)
    });
}

router.post('/register', async function (req, res) {
    // console.log("be hit", req.body)
    var user = new User({
        username: req.body.username,
        studentname: req.body.studentname,
        password: User.hashPassword(req.body.password),
        grade: req.body.grade
    });
    console.log(user)
    var imageUri = process.env.img;
    getFaceId(imageUri, function (response) {
        console.log(response[0].faceId);
        user.faceId = response[0].faceId;
        let promise = user.save();

        promise.then(function (doc) {
            return res.status(201).json(doc);

        });

        promise.catch(function (err) {
            return res.status(500).json({ message: 'Error registering User!' });
        });
    })



});

router.post('/login', async (req, res) => {
    let promise = User.findOne({ userName: req.body.userName }).exec();

    promise.then(function (doc) {
        if (doc) {
            if (doc.isValid(req.body.password)) {
                let token = jwt.sign({ userName: doc.userName }, 'secret', { expiresIn: '2h' });

                return res.status(200).json(token);
            }
            else {
                return res.status(500).json({ message: 'Invalid Credentials' });
            }
        }
        else {
            return res.status(500).json({ message: 'User not Found!' });
        }
    });

    promise.catch(function (err) {
        return res.status(500).json({ message: 'Internal Error' });
    });


});

router.get("/login/:userName", async (req, res) => {
    try {
        const id = req.params.userName;
        const user = await User.findOne({ userName: id });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "No valid entry found" });
        }
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.get('/username', verifyToken, async (req, res) => {
    return res.status(200).json(decodedToken.userName);
});

var decodedToken = '';
function verifyToken(req, res, next) {
    let token = req.query.token;
    jwt.verify(token, 'secret', function (err, tokendata) {
        if (err) {
            return res.status(400).json({ message: 'Unauthorized request' });
        }
        if (tokendata) {
            decodedToken = tokendata;
            next();
        }
    })
}

/* const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `User_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
 */
/* router.post('/file', upload.single('file'), async (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
});

router.post('/multipleFiles', upload.array('files'), async (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({ status: 'ok' });
});
 */
module.exports = router;