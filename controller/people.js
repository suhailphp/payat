const auth = require('../middleware/auth');
const dateformat = require('dateformat');
const express = require('express');
const router = express.Router();
const {peopleModel,validate} = require('../models/peopleModel');
const {transactionModel} = require('../models/transactionModel');


router.get('/', async (req,res)=>{
    let users = await peopleModel.findAll();
    res.render('people/list',{data:users});
});

router.get('/add', (req,res)=>{
    let data;
    if(req.session.reqBody){
        data = req.session.reqBody;
        req.session.reqBody = {};
    }
    res.render('people/add',{data:data});
});


router.get('/edit/:id' ,async (req,res)=>{
    let data = await peopleModel.findOne({ where: {id: req.params.id }});
    let trans = await transactionModel.findOne({ where: {peopleId: req.params.id , openingBalance: 1 } });
    let date = dateformat(trans.date,"yyyy-mm-dd");
    res.render('people/add',{data:data,trans:trans,editData:true,date:date});
});


router.post('/', async (req,res)=>{
    //for update
    if(req.body.action == 'edit'){
        let { error } = validate(req.body);
        if (error){
            let ErrMessage = error.details[0].message.replace(/['"]+/g, '');
            req.session.infoMsg = {code:'error',title:'Error',content:ErrMessage}
            return res.redirect('/people/edit/'+req.body.id);
        }

        people = await peopleModel.findOne({ where: {id: req.body.id } });
        people.name = req.body.name;
        people.houseName = req.body.houseName;
        people.mobile = req.body.mobile;
        people.phone = req.body.phone;
        people.address = req.body.address;
        let result = await people.save();
        if(result){
            let trans = await transactionModel.findOne({ where: {peopleId: req.body.id , openingBalance: 1 } });
            trans.type = req.body.type;
            trans.amount = req.body.amount;
            trans.date = req.body.date;
            if(trans.save()){
                req.session.infoMsg = {code:'success',title:'People updated',content:'People updated successfully'};
                res.redirect('/people');
            }
            else{
                req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
                res.redirect('/people');
            }

        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/people');
        }


    }
    //for insert
    else {
        let { error } = validate(req.body);
        if (error){
            let ErrMessage = error.details[0].message.replace(/['"]+/g, '');
            req.session.infoMsg = {code:'error',title:'Error',content:ErrMessage}
            req.session.reqBody = req.body;
            return res.redirect('/people/add');
        }

        let model = {
            name : req.body.name,
            houseName : req.body.houseName,
            mobile : req.body.mobile,
            phone : req.body.phone,
            address : req.body.address
        }
        let people = await  peopleModel.create(model);
        if(people){
            let modelT = {
                peopleId : people.id,
                openingBalance : true,
                type : req.body.type,
                amount : req.body.amount,
                date : req.body.date
            }
            let transaction = await  transactionModel.create(modelT);
            if(transaction){
                req.session.infoMsg = {code:'success',title:'User created',content:'new People created successfully'};
                res.redirect('/people');
            }
            else{
                req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
                res.redirect('/people');
            }

        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/people');
        }

    }
});







module.exports = router;