const Joi = require("joi");
const Sequelize = require('sequelize');
const db = require('../startup/db');
const config = require('config');

let userModel = db.define('users', {

    id:{
        type: Sequelize.INTEGER,
        autoIncrement : true,
        unique: 'compositeIndex',
        primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING(255)
    },
    userName: {
            type: Sequelize.STRING(255),
            unique: 'compositeIndex'
        },
    password: {
        type: Sequelize.STRING(1000)
    },
    passwordSalt: {
        type: Sequelize.STRING(1000)
    },

    mobile: {
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
    },
    userRole : {
        type: Sequelize.STRING(50),
        defaultValue: 'ADMIN'
    }
});



if (config.DB['SYNC']) {
    userModel.sync({force: config.DB['SYNC_FORCE']}).then(function () {
        // Table created
        return userModel.findOrCreate({
            where: {
                userName: 'admin',
            },
            defaults: {
                fullName: 'Suhail Malayantavida',
                userName: 'admin',
                password: "fc998beddbbf42bc86e052e13a11a2909797639dd1a1e7ff02b2b4c2a74ce49e24f905012ec997d79c28f08e070c0d21d29f5df859ec9179a600e71a2f2a9ad6",
                passwordSalt: "c393308707a1e6287d9533364ece2965",
                userRole: "ADMIN",
                mobile: '+971527947237',
            }
        })
            .then(function (resp, created) {
                if (created)
                    console.log('Default user created USERNAME: admin PASSWORD: asdf')
            });
    });
}


function validate(req){
    const schema = {
        userName: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        confirm: Joi.string().min(5).required(),
        fullName: Joi.string().min(5).required(),
        mobile: Joi.string().min(10).required(),
        id: Joi.string().allow(''),
        action: Joi.string().allow('')
    };

    return Joi.validate(req, schema);
}
function validateUpdate(req){
    const schema = {
        userName: Joi.string().min(5).required(),
        fullName: Joi.string().min(5).required(),
        mobile: Joi.string().min(10).required(),
        id: Joi.string().allow(''),
        action: Joi.string().allow('')
    };

    return Joi.validate(req, schema);
}

exports.userModel = userModel;
exports.validate = validate;
exports.validateUpdate = validateUpdate;
