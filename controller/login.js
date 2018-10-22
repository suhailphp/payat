const Joi = require("joi");
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const {userModel} = require('../models/userModel');

router.get('/',(req,res)=>{

    res.render('login');
});

router.post('/',async(req,res)=>{
    const { error } = validate(req.body);
    if (error){
        let ErrMessage = error.details[0].message.replace(/['"]+/g, '');
        req.session.infoMsg = {code:'error',title:'Login Error',content:ErrMessage}
        return res.redirect('/login');
    }

    let userName = req.body.userName;
    let password = req.body.password;


    let user = await userModel.findOne({ where: {userName: userName,active: true }});

    if(!user){
        req.session.infoMsg = {code:'error',title:'Login Error',content:'User name or password not matching'}
        return res.redirect('/login');
    }

    let passwordHash = crypto.pbkdf2Sync(password, user.passwordSalt, 1000, 64, `sha512`).toString(`hex`);
    if (user.password === passwordHash) {
        req.session.user = {_id:user._id,userName:user.userName,name:user.fullName};
        req.session.infoMsg = {code:'success',title:'Welcome Back',content:'hello Mr '+req.session.user.name};
        user.lastLoggedIn = new Date;
        user.save();
        return res.redirect('/');
    }
    else{
        req.session.infoMsg = {code:'error',title:'Login Error',content:'User name or password not matching'}
        return res.redirect('/login');
    }

});

function validate(req){
    const schema = {
        userName: Joi.string().min(5).required(),
        password: Joi.string().min(5).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;