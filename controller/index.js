const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/',auth,(req,res)=>{
    res.render('index');
});


module.exports = router;