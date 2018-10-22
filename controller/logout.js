const express = require('express');
const session = require("express-session");
const router = express.Router();

router.get('/',(req,res)=>{
    req.session.destroy();
    return res.redirect('/');
});



module.exports = router;