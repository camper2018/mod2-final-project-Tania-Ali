const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const fs = require('fs');
const db = require('./database');
app.use(cors());

app.use(express.json());

// get random recipes of the requested count or limit

// app.get('/recipes/:limit', async function (req, res) {
//   try {
//     const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
//     const limit = parseInt(req.params.limit);
//     const randomIndices = new Set();
//     while (randomIndices.size < limit && randomIndices.size < recipes.length) {
//       let randomIndex = Math.floor(Math.random() * recipes.length);
//       randomIndices.add(randomIndex);
//     }
//     const randomlySelectedRecipes = [...randomIndices].map(index => recipes[index]);
//     res.status(200).json(randomlySelectedRecipes);
//   } catch (err) {
//     console.error('Error fetching recipes!', err);
//     res.status(500).json({ message: 'Error fetching recipes' })
//   }
// });

// get random recipes of the requested count or limit

app.get('/recipes/:limit', async function (req, res) {
  try {
    let limit = req.params.limit;
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
    db.query(sql, (err, result)=> {
      if (err){
        throw err;
      }
      res.status(200).json(result);
    })
  } catch (err) {
    console.error('Error fetching recipes!', err);
    res.status(500).json({ message: 'Error fetching recipes' })
  }
});

// get a requested recipe based on search text from json file
// the text should either partially match recipe name or any of the recipe tag.

// app.get('/search/:searchTerm', async function (req, res) {
//   try {
//     const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
//     const searchTerm = (req.params.searchTerm).toLowerCase().trim();
//     const filteredList = recipes.filter(recipe => {
//       let nameString = '';
//       nameString += recipe.name.toLowerCase().trim() + ' ';
//       // Tags are arrays
//       recipe.tags.forEach(tag => {
//         nameString += tag.toLowerCase().trim() + ' '
//       })
//       return nameString.match(searchTerm);
//     });
//     res.status(200).json(filteredList);
//   } catch (err) {
//     console.error('Error fetching recipes!', err);
//     res.status(500).json({ message: 'Error fetching recipes' })
//   }
// });

// get a requested recipe based on search text from database
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

    db.query(sql, [searchText, searchTerm], (err, result)=> {
      if(err){
        throw err;
      }
      res.status(200).json(result);
    })
   
  } catch (err) {
    console.error('Error searching recipes!', err);
    res.status(500).json({ message: 'Error searching recipes' })
  }
});
// save a recipe to recipes.json file

// app.post('/recipes', async function (req, res) {
//   // adding a recipe to recipes.json file
//   try {
//     const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
//     const newRecipe = req.body;
//     recipes.push(newRecipe);
//     fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2))
//     res.status(201).json({ message: `Recipe with the name ${newRecipe.name} added successfully`, data: null });
//   } catch (err) {
//     console.error('Error adding recipe:', err.message);
//     res.status(500).json({ message: `Error adding recipe with the name ${newRecipe}` })
//   }
// });
// save a recipe to database

// Insert recipe into the recipes table
app.post('/recipes', async function (req, res) {
  const recipe = req.body;
  const {name, favorite, method, ingredients, tags} = recipe;
    const  sql = "INSERT INTO recipes SET ?";
    db.query(sql, {name,  favorite, method }, (err, result) => {
      if (err) {
        throw err;
      }
      const recipeId = result.insertId;
      console.log("recipeId:", recipeId)
      ingredients.forEach(ingredient => {
        const {name, amount, unit, type, category} = ingredient;
        db.query("INSERT INTO ingredients SET ?" , {recipe_id: recipeId, ingredient_name: name,  amount: amount, unit: unit, type: type, category: category }, (err) => {
          if (err) {
            throw err;
          }
         
        })
        
      })
      console.log("Successfully inserted ingredients")
      tags.forEach(tag => {
        db.query("INSERT INTO tags SET ? ", {recipe_id: recipeId, tag_name: tag.trim() }, (err)=> {
          if (err) {
            throw err;
          }
        })
      })
      res.status(201).json({message: "Successfully added recipe with id = " + recipeId});
    })
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

