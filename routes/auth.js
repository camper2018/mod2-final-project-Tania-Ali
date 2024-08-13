const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Hashes the password and inserts the info into the `user` table
router.post('/register', async function (req, res) {
    try {
      const { password, email, username, userIsAdmin } = req.body;
  
      const isAdmin = userIsAdmin ? 1 : 0
  
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if username or email already exists
      const [existingUser] = await req.db.query(`SELECT * FROM users WHERE email = :email OR username = :username`,  { email, username });

      if (existingUser.length > 0) {
          return res.status(409).json({ message: 'Username or email already exists' });
      }
      const [user] = await req.db.query(
        `INSERT INTO users (email, password, username, userIsAdmin)
        VALUES (:email, :hashedPassword, :username, :userIsAdmin);`,
        { email, hashedPassword, username, userIsAdmin: isAdmin });
      const jwtEncodedUser = jwt.sign(
        { userId: user.insertId, ...req.body, userIsAdmin: isAdmin },
        process.env.JWT_KEY
      );
      res.json({ jwt: jwtEncodedUser, success: true, user: { username: username} });
     
    } catch (error) {
      console.error(`Error: ${error.message}` );
      res.status(500).json({ message: "Registration Error! Please try again."});
    }
  });

router.post('/login', async function (req, res) {
    try {
      const { email, password: userEnteredPassword } = req.body;
      const [[user]] = await req.db.query(`SELECT * FROM users WHERE email = :email`, { email });
      if (!user){
        throw Error('Email not found');
      }
      const hashedPassword = `${user.password}`
      const passwordMatches = await bcrypt.compare(userEnteredPassword, hashedPassword);
      if (passwordMatches) {
        const payload = {
          userId: user.id,
          email: user.email,
          username: user.username,
          userIsAdmin: user.userIsAdmin
      }
      const jwtEncodedUser = await jwt.sign(payload, process.env.JWT_KEY);
      res.json({ jwt: jwtEncodedUser, success: true, user: {username: user.username}});
      } else {
         throw Error('Password is wrong');
      }
    } catch (error) {
      console.error('Authentication failed', error.message);
      res.status(401).json({ error: error.message});
    }
  });

module.exports = router;
