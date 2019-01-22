const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const {peopleModel} = require('../models/peopleModel');
const {transactionModel} = require('../models/transactionModel');

router.get('/',async (req,res)=>{
    transactionModel.belongsTo(peopleModel, {foreignKey: 'peopleId'});
    let trans = await transactionModel.findAll({where:{type: 'receive',openingBalance: false},
        include:[{model:peopleModel,required:true}],
        order: [ [ 'id', 'DESC' ]]});
    res.render('getting/list',{data:trans});
});


router.get('/add', async (req,res)=>{
    let data;
    if(req.session.reqBody){
        data = req.session.reqBody;
        req.session.reqBody = {};
    }

    transactionModel.belongsTo(peopleModel, {foreignKey: 'peopleId'});
    let trans = await transactionModel.findAll({where:{type: 'receive',openingBalance: false},
        include:[{model:peopleModel,required:true}],
        limit: 5,
        order: [ [ 'id', 'DESC' ]]
    });


    let people = await peopleModel.findAll();
    res.render('getting/add',{data,people,trans});
});


router.get('/edit/:id',async (req,res)=>{
    let data = await transactionModel.findOne({ where: {id: req.params.id }});
    let people = await peopleModel.findAll();

    transactionModel.belongsTo(peopleModel, {foreignKey: 'peopleId'});
    let trans = await transactionModel.findAll({where:{type: 'receive',openingBalance: false},
        include:[{model:peopleModel,required:true}],
        limit: 5,
        order: [ [ 'id', 'DESC' ]]
    });

    res.render('getting/add',{data:data,people,trans,editData:true});
});

router.post('/', async (req,res)=>{
    //for update
    if(req.body.action == 'edit'){


        let trans = await transactionModel.findOne({ where: {id: req.body.id } });
        trans.peopleId = req.body.peopleId;
        trans.amount = req.body.amount;
        trans.date = req.body.date;

        let result = await trans.save();
        if(result){
            req.session.infoMsg = {code:'success',title:'People updated',content:'Payat updated successfully'};
            res.redirect('/getting/add');

        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/getting');
        }


    }
    //for insert
    else {


        let model = {
            peopleId : req.body.peopleId,
            type : 'receive',
            amount : req.body.amount,
            date : req.body.date

        }
        let trans = await  transactionModel.create(model);
        if(trans){

            req.session.infoMsg = {code:'success',title:'User created',content:'New payat Done'};
            res.redirect('/getting/add');

        }
        else{
            req.session.infoMsg = {code:'error',title:'Something went wrong',content:'something went wrong'};
            res.redirect('/getting');
        }

    }
});


router.get('/peopleInfo/:peopleId', async (req,res)=>{
    let type = '';
    let currentBalance = '';
    let data = await peopleModel.findOne({where:{peopleId: req.params.peopleId}});
    let last = await transactionModel.findOne({where:{peopleId: req.params.peopleId,type:'pay',openingBalance: false},
        order: [ ['id', 'DESC'] ]});
    let pay = await transactionModel.sum('amount',{ where: { peopleId: req.params.peopleId,type: 'pay'}});
    let receive = await transactionModel.sum('amount',{ where: { peopleId: req.params.peopleId,type: 'receive'}});
    pay = parseInt(pay) || 0;
    receive = parseInt(receive) || 0;

    if(pay > receive){
        type = 'കിട്ടാൻ ';
        currentBalance = pay - receive;
    }
    else  if(pay < receive){
        type = 'കൊടുക്കാൻ ';
        currentBalance = receive - pay;
    }
    else{
        type = 'കാലി';
        currentBalance = 0;
    }

    res.render('getting/peopleInfo',{data,last,type,currentBalance});
});


router.delete('/:id',async(req,res)=>{

    const result = await transactionModel.destroy({where:{id:req.params.id}});
    if (!result) return res.send(false);
    res.send(true);


});


module.exports = router;