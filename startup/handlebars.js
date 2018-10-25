const exphbr = require("express-handlebars");
const helper = require('../utilities/helper');

module.exports = function(app){
    let hbs = exphbr.create({
        defaultLayout: 'main',
        extname      : '.html',
        partialsDir: [
            'views/includes/',
        ],
        helpers: helper
    });

    app.engine('.html', hbs.engine);
    app.set('view engine', '.html');


}