const express = require("express");
const bodyParser = require('body-parser');

const infoMsg = require("../middleware/infoMsg");
const index = require("../controller/index");
const login = require("../controller/login");

module.exports = function(app){

    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(infoMsg);
    app.use('/login', login);
    app.use('/', index);



}