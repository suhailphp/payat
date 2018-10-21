/**
 * Created by suhail
 */
var Sequelize = require('sequelize');
var db = require('../startup/db');
var config = require('config');

var User = db.define('GMSUsers', {
    userName: {
        type: Sequelize.STRING(255),
        unique: 'compositeIndex',
        primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING(255)
    }
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

module.exports = User;


if (config.DB['SYNC']) {
    User.sync({force: config.DB['SYNC_FORCE']}).then(function () {
        // Table created
        return User.findOrCreate({
            where: {
                userName: 'admin',
            },
            defaults: {
                fullName: 'Suhail Malayantavida',
                userName: 'admin',
                password: "7c337c005fd861d11d45cef7d7e00bc7d4e29f5b2932ea7f7e9cfe9c061944b6eb3027de0c7c77beb82b7919f9137f671a8e499812c76546c9b3085eb4325169",
                passwordSalt: "a355fa04b0ddeaa6bcb1f8c2d9517049",
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