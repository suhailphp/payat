const Joi = require("joi");
const Sequelize = require('sequelize');
const db = require('../startup/db');
const config = require('config');


let peopleModel = db.define('people', {

    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        unique: 'compositeIndex',
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(255)
    },
    houseName: {
        type: Sequelize.STRING(255)
    },
    address: {
        type: Sequelize.STRING(1000)
    },

    mobile: {
        type: Sequelize.STRING(255)
    },

    phone: {
        type: Sequelize.STRING(255)
    },

    createdOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedOn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});


if (config.DB['SYNC']) {
    peopleModel.sync({force: config.DB['SYNC_FORCE']});
}

function validate(req){
    const schema = {
        name: Joi.string().min(5).required(),
        houseName: Joi.string().allow(''),
        address: Joi.string().allow(''),
        mobile: Joi.string().allow(''),
        phone: Joi.string().allow(''),
        type: Joi.string().allow(''),
        amount: Joi.number().allow(0),
        date: Joi.date().allow(''),
        id: Joi.string().allow(''),
        action: Joi.string().allow('')
    };

    return Joi.validate(req, schema);
}

exports.peopleModel = peopleModel;
exports.validate = validate;

