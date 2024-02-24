const mysql = require('mysql2');
require('dotenv').config();


// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})
db.connect((err) => {

  if (err) {
    throw err;
  }
  console.log("MySql Connected");
});

module.exports = db;
