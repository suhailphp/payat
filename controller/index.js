const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {peopleModel} = require('../models/peopleModel');
const {transactionModel} = require('../models/transactionModel');

router.get('/', auth,async(req,res)=>{
    let peoples = await peopleModel.findAll();

    let kittan = 0;
    let kodkan = 0;
    let totalPeople = 0;
    for (let people of peoples){

        totalPeople++;

        let pay = await transactionModel.sum('amount',{ where: { peopleId: people.peopleId,type: 'pay'}});
        let receive = await transactionModel.sum('amount',{ where: { peopleId: people.peopleId,type: 'receive'}});
        pay = parseInt(pay) || 0;
        receive = parseInt(receive) || 0;

        if(pay > receive){

            kittan = kittan + (pay - receive);
        }
        else  if(pay < receive){
            kodkan = kodkan + (receive - pay)
        }



    }

    let total = kodkan+kittan;
    let KittanPers = ((kittan/total)*100).toFixed(2);
    let KodkanPers = ((kodkan/total)*100).toFixed(2);

    transactionModel.belongsTo(peopleModel, {foreignKey: 'peopleId'});
    let trans = await transactionModel.findAll({where:{type: 'pay',openingBalance: false},
        include:[{model:peopleModel,required:true}],
        limit: 5,
        order: [ [ 'id', 'DESC' ]]
    });

    kittan = kittan.toFixed(2);
    kodkan = kodkan.toFixed(2);
    res.render('index',{totalPeople,kittan,kodkan,KittanPers,KodkanPers,trans});
});


module.exports = router;