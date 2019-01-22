const express = require('express');
const router = express.Router();


router.get('/',async (req,res)=>{
    var exec = require('child_process').exec('mysqldump --all-databases payat --user=root --password rootroot > backup-mydb1.sql');

});




module.exports = router;