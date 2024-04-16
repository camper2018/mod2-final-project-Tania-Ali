const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJwt');
// Create tables
router.get("/tables", verifyJwt, async (req, res) => {
    if (!req.user.userIsAdmin) {
        res.status(401).json({ error: 'Unauthorized access!' });
    } else {
        const createTableRecipesSQL = `
    CREATE TABLE IF NOT EXISTS recipes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            favorite BOOLEAN NOT NULL DEFAULT false,
            tags JSON,
            method TEXT
       );
    `
        const createTableIngredientsSQL = `
        CREATE TABLE IF NOT EXISTS ingredients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recipe_id INT,
            name VARCHAR(255) NOT NULL,
            amount VARCHAR(50) NOT NULL,
            unit VARCHAR(50),
            type VARCHAR(50),
            category VARCHAR(50),
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );
      `
        const createTableTagsSQL = `
        CREATE TABLE IF NOT EXISTS tags(
            id INT AUTO_INCREMENT PRIMARY KEY,
            recipe_id INT,
            name VARCHAR(255) NOT NULL,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
        );
      `
        try {
            await req.db.query(createTableRecipesSQL);
            await req.db.query(createTableIngredientsSQL);
            await req.db.query(createTableTagsSQL);
            res.json({ message: "Database initialized with tables successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Failed to initialize database with tables: ${err.message}` });
        }
    }
});
module.exports = router;
