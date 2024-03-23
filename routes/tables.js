const express = require('express');
const router = express.Router();

// Create tables
router.get("/tables", async (req, res) => {
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
        res.status(500).json({ message: "Failed to initialize database with tables" });
    }
});
module.exports = router;
