const express = require("express");
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', function(req,res,next){
    var user = new User({
        userName: req.body.userName,
        password: User.hashPassword(req.body.password),
        faceID: req.body.faceID,
        grade: req.body.grade
    });

    let promise = user.save();

    promise.then(function(doc){
        return res.status(201).json(doc);
    });

    promise.catch(function(err){
        return res.status(500).json({message: 'Error registering User!'});
    });
});

router.post('/login', function(req,res,next){
    let promise = User.findOne({userName: req.body.userName}).exec();

    promise.then(function(doc){
        if(doc){
            if(doc.isValid(req.body.password)){
                let token = jwt.sign({userName: doc.userName},'secret', {expiresIn: '2h'});

                return res.status(200).json(token);
            }
            else{
                return res.status(500).json({message: 'Invalid Credentials'});
            }
        }
        else{
            return res.status(500).json({message: 'User not Found!'}); 
        }
    });

    promise.catch(function(err){
        return res.status(500).json({message: 'Internal Error'});
    })


});

router.get('/username', verifyToken, function(req,res,next){
    return res.status(200).json(decodedToken.userName);
});

var decodedToken = '';
function verifyToken(req,res,next){
    let token = req.query.token;
    jwt.verify(token,'secret',function(err, tokendata){
        if(err){
            return res.status(400).json({message: 'Unauthorized request'});
        }
        if(tokendata){
            decodedToken = tokendata;
            next();
        }
    })
}

module.exports = router;