const session = require("express-session");
const exphbr = require("express-handlebars");
const http = require('http');

module.exports = function(req,res,next){
    //console.log(req.session.user);

    if(!req.session.user){
        req.session.infoMsg = {code:'warning',title:'Please Login',content:'Must be login to use the application'};
        return res.redirect('/login');
    }

    next();
}