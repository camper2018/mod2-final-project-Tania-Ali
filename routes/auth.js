const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Hashes the password and inserts the info into the `user` table
router.post('/register', async function (req, res) {
    try {
      const { password, email, userIsAdmin } = req.body;
  
      const isAdmin = userIsAdmin ? 1 : 0
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const [user] = await req.db.query(
        `INSERT INTO users (email, password, userIsAdmin)
        VALUES (:email, :hashedPassword, :userIsAdmin);`,
        { email, hashedPassword, userIsAdmin: isAdmin });
  
      const jwtEncodedUser = jwt.sign(
        { userId: user.insertId, ...req.body, userIsAdmin: isAdmin },
        process.env.JWT_KEY
      );
      res.json({ jwt: jwtEncodedUser, success: true, user: {id: user.insertId, email: email} });
    } catch (error) {
      res.json({ error: error.message, success: false });
    }
  });

router.post('/log-in', async function (req, res) {
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
          userIsAdmin: user.userIsAdmin
      }
      const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY);
      res.json({ jwt: jwtEncodedUser, success: true, user: { id: user.id, email: email}});
      } else {
         throw Error('Password is wrong');
      }
    } catch (error) {
      console.error('Authentication failed', error);
      res.json({ error: error.message, success: false });
    }
  });

module.exports = router;
  