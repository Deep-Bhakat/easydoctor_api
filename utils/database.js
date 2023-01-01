var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost",
  user: "eazydoctor",
  password: "Apiece_1000",
  database: "doctor"
});
module.exports = con;