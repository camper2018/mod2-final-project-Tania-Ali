const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const corsOptions = {
  origin: '*', 
  credentials: true,  
  'access-control-allow-credentials': true,
  optionSuccessStatus: 200,
}
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
});
app.use(cors(corsOptions));
// to connect to mysql first type in the terminal
// brew services start mysql
// following code will start a db connection and attach it to the request object
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
    console.log(err)
    // If an error occurs, disconnects from the database
    if (req.db) req.db.release();
    throw err;
  }
});
app.use(express.json());
// create database;
app.get("/createdb",async (req, res) => {
  const sql = "CREATE DATABASE IF NOT EXISTS recipedia";
  try {
    await req.db.query(sql);
    res.json("Database created");
  } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error creating database'})
  }
});
// Create tables
app.get("/createTableIngredients",async (req, res) => {
  const sql =
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
  try {
    await req.db.query(sql);
    res.send("Ingredients table created");
  } catch (err){
    console.error(err);
    res.status(500).json({ message: 'Error creating table "ingredients"'})
  }

});
app.get("/createTableTags", async (req, res) => {
  const sql =
    `CREATE TABLE IF NOT EXISTS tags(
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  )`
  try {
    await req.db.query(sql);
    res.send("Tags table created");
  } catch (err){
    console.error(err);
    res.status(500).json({ message: 'Error creating table "tags"'})
  }

});
app.get("/createTableRecipes", async (req, res) => {
  const sql =
    `CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    favorite BOOLEAN NOT NULL DEFAULT false,
    tags JSON,
    method TEXT
  )`
  try {
    await req.db.query(sql);
    res.send("Recipes table created");
  } catch (err){
    console.error(err);
    res.status(500).json({ message: 'Error creating table "recipes"'})
  }
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
    const [result] = await req.db.query(sql);
    res.status(200).json(result);
    
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

    const [result] = await req.db.query(sql, [searchText, searchTerm]);
    res.status(200).json(result);
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

    const [result] = await req.db.query(sql, [recipeId]);
    if (result.length === 0) {
        res.status(404).json({ message: 'Recipe not found' });
    } else {
      res.json(result[0]);
    }
});

// save a recipe to database

// ** using positional parameters **

// app.post('/recipes', async function (req, res) {
//   const recipe = req.body;
//   const { name, favorite, method, ingredients, tags } = recipe;
//   const recipesQuery = "INSERT INTO recipes SET ?";
//   const ingredientsQuery = "INSERT INTO ingredients SET ?";
//   const tagsQuery = "INSERT INTO tags SET ? ";
//   let recipeId;
//   try {
//     await req.db.beginTransaction();
//     try {
//       const [result] = await req.db.query(recipesQuery, { name, favorite, method });
//       recipeId = result.insertId;
//       console.log("recipeId:", recipeId);
//       await Promise.all(ingredients.map(async (ingredient) => {
//         const { name, amount, unit, type, category } = ingredient;
//         await req.db.query(ingredientsQuery, { recipe_id: recipeId, ingredient_name: name, amount: amount, unit: unit, type: type, category: category });
//       }))
//       await Promise.all(tags.map(async (tag)=> {
//         await req.db.query(tagsQuery, { recipe_id: recipeId, tag_name: tag?.trim() });
//       }));
//       await req.db.commit();
//       res.status(201).json({ message: "Successfully added recipe with id = " + recipeId });
//     } catch(err){
//       await req.db.rollback();
//       res.status(500).json({ message: "Internal Server! Failed to save recipe with id = " + recipeId });
//     }
//   } catch(err){
//     console.log(recipeId);
//     res.status(500).json({ error: 'Database connection error' + err});
//   }
// });

// ** using named parameters **

app.post('/recipes', async function (req, res) {
  const recipe = req.body;
  const { name, favorite, method, ingredients, tags } = recipe;
  const recipesQuery = "INSERT INTO recipes SET :recipe";
  const ingredientsQuery = "INSERT INTO ingredients SET :ingredient";
  const tagsQuery = "INSERT INTO tags SET :tag ";
  console.log("I am inside POST")
  let recipeId;
  try {
    await req.db.beginTransaction();
    try {
      const [result] = await req.db.query(recipesQuery, {recipe: { name, favorite, method }});
      recipeId = result.insertId;
      console.log("recipeId:", recipeId);
      await Promise.all(ingredients.map(async (ingredient) => {
        const { name, amount, unit, type, category } = ingredient;
        await req.db.query(ingredientsQuery, {ingredient:{ recipe_id: recipeId, ingredient_name: name, amount: amount, unit: unit, type: type, category: category }});
      }))
      await Promise.all(tags.map(async (tag)=> {
        await req.db.query(tagsQuery, {tag:{ recipe_id: recipeId, tag_name: tag?.trim() }});
      }));
      await req.db.commit();
      res.status(201).json({ message: "Successfully added recipe with id = " + recipeId });
    } catch(err){
      await req.db.rollback();
      res.status(500).json({ message: "Internal Server! Failed to save recipe with id = " + recipeId });
    }
  } catch(err){
    console.log(recipeId);
    res.status(500).json({ error: 'Database connection error' + err});
  }
});

// Edit a recipe

// ** using positional parameters

// app.put('/recipes/:id', async (req, res) => {
//   const recipeId = req.params.id;
//   const { name, favorite, method, ingredients, tags } = req.body;
//   const updateRecipeQuery = `UPDATE recipes SET name = ?, favorite = ?, method = ? WHERE id = ?`;
//   const deleteIngredientsQuery = `DELETE FROM ingredients WHERE recipe_id = ?`;
//   const insertIngredientsQuery = `INSERT INTO ingredients (ingredient_name, amount, unit, type, category, recipe_id) VALUES ?`;
//   const deleteTagsQuery = `DELETE FROM tags WHERE recipe_id=?`;
//   const insertTagsQuery = `INSERT INTO tags (tag_name, recipe_id) VALUES ?`;
//   try {
//     await req.db.beginTransaction();
//     try { 
//       await req.db.query(updateRecipeQuery, [name, favorite, method, recipeId]);
//       await req.db.query(deleteIngredientsQuery, [recipeId]);
//       const ingredientValues = ingredients.map(ingredient => [ingredient.name, ingredient.amount, ingredient.unit, ingredient.type, ingredient.category, recipeId]);
//       await req.db.query(insertIngredientsQuery, [ingredientValues]);
//       await req.db.query(deleteTagsQuery, [recipeId]);
//       const tagValues = tags.map(tag => [tag , recipeId]);
//       await req.db.query(insertTagsQuery, [tagValues]);
//       await req.db.commit();
//       res.status(200).json({ message: 'Update successful' });
//     } catch(err){
//         // Rollback transaction if any update fails
//         await req.db.rollback();
//         // Send error response
//         console.error(err);
//         res.status(500).json({ error: 'Error updating recipe: '+ err });
//     }
//   } catch(err){
//     // Send error response if unable to start transaction or get connection
//     res.status(500).json({ error: 'Database connection error' });
//   }
// });

// ** using named parameters **

app.put('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const { name, favorite, method, ingredients, tags } = req.body;
  const updateRecipeQuery = `UPDATE recipes SET name = :name, favorite = :favorite, method = :method WHERE id = :id`;
  const deleteIngredientsQuery = `DELETE FROM ingredients WHERE recipe_id = :recipeId`;
  const insertIngredientsQuery = `INSERT INTO ingredients (ingredient_name, amount, unit, type, category, recipe_id) VALUES :ingredientValues`;
  const deleteTagsQuery = `DELETE FROM tags WHERE recipe_id=:recipeId`;
  const insertTagsQuery = `INSERT INTO tags (tag_name, recipe_id) VALUES :tagValues`;
  try {
    await req.db.beginTransaction();
    try { 
      await req.db.query(updateRecipeQuery, {name, favorite, method, id: recipeId});
      await req.db.query(deleteIngredientsQuery, {recipeId});
      const ingredientValues = ingredients.map(ingredient => [ingredient.name, ingredient.amount, ingredient.unit, ingredient.type, ingredient.category, recipeId]);
      await req.db.query(insertIngredientsQuery, {ingredientValues});
      await req.db.query(deleteTagsQuery, {recipeId});
      const tagValues = tags.map(tag => [tag , recipeId]);
      await req.db.query(insertTagsQuery, {tagValues});
      await req.db.commit();
      res.status(200).json({ message: 'Update successful' });
    } catch(err){
        // Rollback transaction if any update fails
        await req.db.rollback();
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

// ** using positional parameters

// app.delete('/recipes/:id', async (req, res) => {
//   const recipeId = req.params.id;
//   const deleteRecipeQuery = 'DELETE FROM recipes WHERE id = ?';
//   try{
//     const [result] = await req.db.query(deleteRecipeQuery, [recipeId]);
//     if (result.affectedRows === 0) {
//       res.status(404).json({ error: 'Recipe not found!' });
//     } else {
//       res.status(200).json({ message: 'Recipe deleted successfully. ', recipeId })
//     }
//   } catch(err){
//     console.error('Error deleting recipe:', error);
//     res.status(500).json({error:'Internal Server Error'})
//   }
// });

// ** using named parameters **

app.delete('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  const deleteRecipeQuery = 'DELETE FROM recipes WHERE id = :recipeId';
  try{
    const [result] = await req.db.query(deleteRecipeQuery, {recipeId});
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Recipe not found!' });
    } else {
      res.status(200).json({ message: 'Recipe deleted successfully. ', recipeId })
    }
  } catch(err){
    console.error('Error deleting recipe:', error);
    res.status(500).json({error:'Internal Server Error'})
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
