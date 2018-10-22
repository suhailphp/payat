const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const {userModel,validate,validateUpdate} = require('../models/userModel');

router.get('/',async (req,res)=>{
    let users = await userModel.findAll();
    res.render('user/list',{data:users});
});

router.get('/add',async (req,res)=>{
    let data;
    if(req.session.reqBody){
        data = req.session.reqBody;
        req.session.reqBody = {};
    }
    res.render('user/add',{data:data});
});

router.get('/add/:id',async (req,res)=>{
    let data = await userModel.findOne({ where: {id: req.params.id }});
    res.render('user/add',{data:data,editData:true});
});

router.post('/',async (req,res)=>{

    //for update
    if(req.body.action == 'edit'){
        let { error } = validateUpdate(req.body);
        if (error){
            let ErrMessage = error.details[0].message.replace(/['"]+/g, '');
            req.session.infoMsg = {code:'error',title:'Error',content:ErrMessage}
            return res.redirect('/user/add/'+req.body.id);
        }
        let user = await userModel.findOne({ where: {userName: req.body.userName , id :{ $ne:req.body.id }} });
        if(user){
            req.session.infoMsg = {code:'error',title:'User name taken',content:'please chose other username'}
            req.session.reqBody = req.body;
            return res.redirect('/user/add/'+req.body.id);
        }
        user = await userModel.findOne({ where: {id: req.body.id } });
        user.fullName = req.body.fullName;
        user.userName = req.body.userName;
        user.mobile = req.body.mobile;
        let result = await user.save();
        if(result){
            req.session.infoMsg = {code:'success',title:'User updated',content:'new user updated successfully'};
            res.redirect('/user');
        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/user');
        }


    }
    //for insert
    else {
        let { error } = validate(req.body);
        if (error){
            let ErrMessage = error.details[0].message.replace(/['"]+/g, '');
            req.session.infoMsg = {code:'error',title:'Error',content:ErrMessage}
            req.session.reqBody = req.body;
            return res.redirect('/user/add');
        }
        if(req.body.password != req.body.confirm){
            req.session.infoMsg = {code:'error',title:'Password not matching',content:'please confirm your password'}
            req.session.reqBody = req.body;
            return res.redirect('/user/add');
        }
        let user = await userModel.findOne({ where: {userName: req.body.userName }});
        if(user){
            req.session.infoMsg = {code:'error',title:'User name taken',content:'please chose other username'}
            req.session.reqBody = req.body;
            return res.redirect('/user/add');
        }

        let model = {
            fullName : req.body.fullName,
            userName : req.body.userName,
            password : req.body.password,
            mobile : req.body.mobile
        }
        let result = await  userModel.create(model);
        if(result){
            req.session.infoMsg = {code:'success',title:'User created',content:'new user created successfully'};
            res.redirect('/user');
        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/user');
        }

    }

});

router.delete('/:id',async(req,res)=>{

    const result = await userModel.destroy({where:{id:req.params.id}});
    if (!result) return res.send(false);
    res.send(true);


});


module.exports = router;