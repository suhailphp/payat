const express = require('express');
const router = express.Router();
const {userModel} = require('../models/userModel');

router.get('/',(req,res)=>{
    res.render('login');
});


module.exports = router;