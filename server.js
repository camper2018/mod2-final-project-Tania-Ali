const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const corsOptions = {
  origin: '*',
  credentials: true,
  'access-control-allow-credentials': true,
  optionSuccessStatus: 200,
}

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`
const pool = mysql.createPool(urlDB);
app.use(cors(corsOptions));
app.use(cookieParser());
//to parse JSON bodies in POST and PUT requests
// built-in body parser.
app.use(express.json());

// To connect to mysql db, first type in the terminal: 'brew services start mysql'
// Following code will start a db pool connection and attach it to the request object as it's property.
app.use(async (req, res, next) => {
  try {
    // Connecting to our SQL db. req gets modified and is available down the line in other middleware and endpoint functions
    req.db = await pool.getConnection();
    req.db.connection.config.namedPlaceholders = true;
    // Traditional mode ensures not null is respected for un supplied fields, ensures valid JavaScript dates, etc.
    await req.db.query('SET SESSION sql_mode = "TRADITIONAL"');
    await req.db.query(`SET time_zone = '-8:00'`);

    // Moves the request on down the line to the next middleware functions and/or the endpoint it's headed for
    await next();
    // After the endpoint has been reached and resolved, disconnects from the database
    req.db.release();
  } catch (err) {
    // If anything downstream throw an error, we must release the connection allocated for the request
    // If an error occurs, disconnects from the database
    if (req.db) req.db.release();
    throw err;
  }
});

// api routes
app.use('/api/auth', require('./routes/auth'))

// Jwt verification checks to see if there is an authorization header with a valid jwt in it.
// app.use(verifyJwt);

app.use('/api/init', require('./routes/tables'));
app.use('/api/recipes', require('./routes/recipes'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${process.env.BASE_URL}:${port}`);
});
