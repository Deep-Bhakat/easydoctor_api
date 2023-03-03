var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "MYSQL8003.site4now.net",
  user: "a958e9_genesis",
  password: "Apiece_1000",
  database: "db_a958e9_genesis",
});

con.connect();
module.exports = con;