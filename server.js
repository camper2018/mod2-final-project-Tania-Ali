const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const fs = require('fs');
const db = require('./database');
app.use(cors());
app.use(express.json());

// create database;
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE IF NOT EXISTS recipedia";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.json("Database created");
  });
});
// Create tables
app.get("/createTableIngredients", (req, res) => {
  let sql =
    `CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    type VARCHAR(50),
    category VARCHAR(50),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send("Ingredients table created");

  });

});
app.get("/createTableTags", (req, res) => {
  let sql =
    `CREATE TABLE IF NOT EXISTS tags(
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send("Tags table created");

  });

});
app.get("/createTableRecipes", (req, res) => {
  let sql =
    `CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    favorite BOOLEAN NOT NULL DEFAULT false,
    tags JSON,
    method TEXT
  )`
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send("Recipes table created");

  });

});
// get random recipes of the requested count or limit from database

app.get('/recipes/:limit?', async function (req, res) {
  try {
    let limit = req.params.limit || '20';
    const sql = `SELECT
    r.id,
    r.name,
    CASE r.favorite
        WHEN 0 THEN false
        WHEN 1 THEN true
    END AS favorite,
    r.method,
    JSON_ARRAYAGG(JSON_OBJECT('id', i.ingredient_id, 'name', i.ingredient_name, 'amount', i.amount, 'unit', i.unit, 'type', i.type, 'category', i.category)) AS ingredients,
    (SELECT JSON_ARRAYAGG(t.tag_name) FROM (SELECT DISTINCT tag_name FROM tags WHERE recipe_id = r.id AND tag_name IS NOT NULL)t) AS tags
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    LEFT JOIN tags t ON r.id = t.recipe_id
    GROUP BY r.id, r.name, r.favorite, r.method
    ORDER BY RAND()
    LIMIT ${limit};
    `
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json(result);
    })
  } catch (err) {
    console.error('Error fetching recipes!', err);
    res.status(500).json({ message: 'Error fetching recipes' })
  }
});

// get a requested recipe based on search text from database
// the text should either partially match recipe name or any of the recipe tag.

app.get('/search/:searchTerm', async function (req, res) {
  try {
    const searchTerm = (req.params.searchTerm).toLowerCase().trim();
    const sql = `
    SELECT
    r.id,
    r.name,
    r.favorite,
    r.method,
    JSON_ARRAYAGG(JSON_OBJECT('id', i.ingredient_id, 'name', i.ingredient_name, 'amount', i.amount, 'unit', i.unit, 'type', i.type, 'category', i.category)) AS ingredients,
    (SELECT JSON_ARRAYAGG(t.tag_name) FROM (SELECT DISTINCT tag_name FROM tags WHERE recipe_id = r.id AND tag_name IS NOT NULL)t) AS tags
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    LEFT JOIN tags t ON r.id = t.recipe_id
	  WHERE r.name LIKE ? OR t.tag_name = ?
    GROUP BY r.id;
    `
    const searchText = `%${searchTerm}%`;

    db.query(sql, [searchText, searchTerm], (err, result) => {
      if (err) {
        throw err;
      }
      res.status(200).json(result);
    })

  } catch (err) {
    console.error('Error searching recipes!', err);
    res.status(500).json({ message: 'Error searching recipes' })
  }
});

// get recipe by id
app.get('/recipe/:id', async function (req, res) {
  const recipeId = req.params.id;
  const sql = `SELECT
    r.id,
    r.name,
    r.favorite,
    r.method,
    JSON_ARRAYAGG(JSON_OBJECT('id', i.ingredient_id, 'name', i.ingredient_name, 'amount', i.amount, 'unit', i.unit, 'type', i.type, 'category', i.category)) AS ingredients,
    (SELECT JSON_ARRAYAGG(t.tag_name) FROM (SELECT DISTINCT tag_name FROM tags WHERE recipe_id = r.id AND tag_name IS NOT NULL)t) AS tags
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    LEFT JOIN tags t ON r.id = t.recipe_id
    WHERE r.id = ?
    GROUP BY r.id, r.name, r.favorite, r.method
    ;`;

  db.query(sql, [recipeId], (err, result) => {
    if (err) {
      console.error(`Error fetching recipe:`, err.message);
      res.status(500).json({ message: 'Server Error' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: 'Recipe not found' });
      } else {
        res.json(result[0]);
      }
    }
  })
});

// save a recipe to database
app.post('/recipes', async function (req, res) {
  const recipe = req.body;
  const { name, favorite, method, ingredients, tags } = recipe;
  const recipesQuery = "INSERT INTO recipes SET ?";
  const ingredientsQuery = "INSERT INTO ingredients SET ?";
  const tagsQuery = "INSERT INTO tags SET ? ";
  try {
    db.beginTransaction();
    try {
      let recipeId;
      db.query(recipesQuery, { name, favorite, method }, (err, result) => {
        if (err) {
          throw new Error(err);
        }
        recipeId = result.insertId;
        ingredients.forEach(ingredient => {
          const { name, amount, unit, type, category } = ingredient;
          db.query(ingredientsQuery, { recipe_id: recipeId, ingredient_name: name, amount: amount, unit: unit, type: type, category: category });
        });
        tags.forEach(tag => {
          db.query(tagsQuery, { recipe_id: recipeId, tag_name: tag.trim() });     
        });
      });
      db.commit();
      res.status(201).json({ message: "Successfully added recipe with id = " + recipeId });
    } catch(err){
      db.rollback();
      res.status(500).json({ message: "Internal Server! Failed to save recipe with id = " + recipeId });
    }
  }catch(err){
    res.status(500).json({ error: 'Database connection error'});
  }
});
// Edit a recipe

app.put('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { name, favorite, method, ingredients, tags } = req.body;
  const updateRecipeQuery = `UPDATE recipes SET name = ?, favorite = ?, method = ? WHERE id = ?`;
  const deleteIngredientsQuery = `DELETE FROM ingredients WHERE recipe_id = ?`;
  const insertIngredientsQuery = `INSERT INTO ingredients (ingredient_name, amount, unit, type, category, recipe_id) VALUES ?`;
  const deleteTagsQuery = `DELETE FROM tags WHERE recipe_id=?`;
  const insertTagsQuery = `INSERT INTO tags (tag_name, recipe_id) VALUES ?`;
  try {
    db.beginTransaction();
    try { 
      db.query(updateRecipeQuery, [name, favorite, method, recipeId]);
      db.query(deleteIngredientsQuery, [recipeId]);
      const ingredientValues = ingredients.map(ingredient => [ingredient.name, ingredient.amount, ingredient.unit, ingredient.type, ingredient.category, recipeId]);
      db.query(insertIngredientsQuery, [ingredientValues]);
      db.query(deleteTagsQuery, [recipeId]);
      const tagValues = tags.map(tag => [tag , recipeId]);
      db.query(insertTagsQuery, [tagValues]);
      db.commit();
      res.status(200).json({ message: 'Update successful' });
    } catch(err){
        // Rollback transaction if any update fails
        db.rollback();
        // Send error response
        console.error(err);
        res.status(500).json({ error: 'Error updating recipe: '+ err });
    }
  } catch(err){
    // Send error response if unable to start transaction or get connection
    res.status(500).json({ error: 'Database connection error' });
  }
});

// Delete a recipe

app.delete('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const deleteRecipeQuery = 'DELETE FROM recipes WHERE id = ?';
  db.query(deleteRecipeQuery, [recipeId], (err, result) => {
    if (err) {
      console.error('Error deleting recipe:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Recipe not found!' });
      } else {
        res.status(200).json({ message: 'Recipe deleted successfully. ', recipeId })
      }
    }
  })
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
