const Sequelize = require('sequelize');
const db = require('../startup/db');
const config = require('config');



let transactionModel = db.define('transaction', {

    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        unique: 'compositeIndex',
        primaryKey: true
    },
    peopleId:{
        type: Sequelize.INTEGER
    },
    openingBalance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    type: {
        type:   Sequelize.ENUM,
        values: ['pay', 'receive']
    },
    amount: {
        type: Sequelize.FLOAT
    },
    date: {
        type: Sequelize.DATE
    }

});

if (config.DB['SYNC']) {
    transactionModel.sync({force: config.DB['SYNC_FORCE']});
}


exports.transactionModel = transactionModel;

