const Sequelize = require('sequelize');
const Config = require('config');



    let dbName = process.env.DATABASE || Config.DB['DATABASE'] || 'psa';
    let dbUsername = process.env.DB_USERNAME || Config.DB['USERNAME'] || 'root';
    let dbPassword = process.env.DB_PASSWORD || Config.DB['PASSWORD'] || null;
    let dbs = process.env.DIALECT || Config.DB['DIALECT'] || 'mysql';
    let dbHost = process.env.DB_HOST || Config.DB['HOST'] || 'localhost';
    let dbPort = process.env.DB_PORT || Config.DB['PORT'] || 3306;

    let db = new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        dialect: dbs,
        port: dbPort,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: Config.DB['QUERY_LOG']
    });


    //var db = new Sequelize('mysql://localhost/psa?characterEncoding=UTF-8&useUnicode=yes');

    // test connection
    db.authenticate()
        .then(function (err) {
            console.log('DB Connection has been established successfully.');
        })
        .catch(function (err) {
            console.log('Unable to connect to the database:', err);
        });


module.exports = db;