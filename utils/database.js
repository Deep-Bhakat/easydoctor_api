var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "MYSQL5039.site4now.net",
  user: "a926dd_doctor",
  password: "Apiece_1000",
  database: "db_a926dd_doctor",
});

con.connect();
module.exports = con;