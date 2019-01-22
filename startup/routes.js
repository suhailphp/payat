const express = require("express");
const bodyParser = require('body-parser');

const infoMsg = require("../middleware/infoMsg");
const login = require("../controller/login");
const logout = require("../controller/logout");
const index = require("../controller/index");
const user = require("../controller/user");
const people = require("../controller/people");
const giving = require("../controller/giving");
const getting = require("../controller/getting");
const backup = require("../controller/backup");

module.exports = function(app){

    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(infoMsg);
    app.use('/login', login);
    app.use('/logout', logout);
    app.use('/', index);
    app.use('/user', user);
    app.use('/people', people);
    app.use('/giving', giving);
    app.use('/getting', getting);
    app.use('/backup', backup);

}