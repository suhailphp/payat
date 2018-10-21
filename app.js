const express = require("express");
const path = require("path");


const app = express();



app.use('', express.static(path.join(__dirname, 'public')));

app.use(express.json());




require('./startup/db')();
require('./startup/handlebars')(app);
require('./startup/session')(app);
require('./startup/routes')(app);




const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Application running on port '+port);
});