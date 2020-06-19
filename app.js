const express = require("express");
const path = require("path");


const app = express();


//some of plugin not have support 


app.use('', express.static(path.join(__dirname, 'public')));

app.use(express.json());




require('./startup/db');
require('./startup/handlebars')(app);
require('./startup/session')(app);
require('./startup/routes')(app);




const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log('Application running on port '+port);
});