const exphbr = require("express-handlebars");

module.exports = function(app){
    let hbs = exphbr.create({
        defaultLayout: 'main',
        extname      : '.html',
        partialsDir: [
            'views/includes/',
        ]
    });

    app.engine('.html', hbs.engine);
    app.set('view engine', '.html');


}