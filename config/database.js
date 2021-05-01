const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "soumyadeep",
  password: "db@dmin",
  database: "erp-system",
});

module.exports = pool;
