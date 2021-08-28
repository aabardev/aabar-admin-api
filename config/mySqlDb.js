var mysql = require('mysql');
const env = require('node-env-file');
env('.env');
var connection = mysql.createPool({
    host     : process.env.MYSQLHOST,
    user     : process.env.MYSQLUSER,
    password : process.env.MYSQLPASSWORD,
    database : process.env.MYSQLDATABASE,
    connectionLimit: parseInt(process.env.CONN_LIMIT)
});

/*connection.connect(function(err) {
    if (err) throw err;
});*/

module.exports = connection;
