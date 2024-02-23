const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const fs = require('fs');

app.use(cors());

app.use(express.json());

// get recipe by search query from recipes.json file
app.get('/search/:searchTerm', async function (req, res) {
  try {
    const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
    const searchTerm = (req.params.searchTerm).toLowerCase().trim();
    const filteredList = recipes.filter(recipe => {
      let nameString = '';
      nameString += recipe.name.toLowerCase().trim() + ' ';
      // Tags are arrays
      recipe.tags.forEach(tag => {
        nameString += tag.toLowerCase().trim() + ' '
      })
      return nameString.match(searchTerm);
    });
    res.status(200).json(filteredList);
  } catch (err) {
    console.error('Error fetching recipes!', err);
    res.status(500).json({ message: 'Error fetching recipes' })
  }
});
// save a recipe to recipes.json file
app.post('/recipes', async function (req, res) {
  // adding a recipe to recipes.json file
  try {
    const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
    console.log(recipes, "recipes")
    console.log(req.body, "req.body")
    const newRecipe = req.body;
    recipes.push(newRecipe);
    fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2))
    //  console.log("recipes:", recipes);
    // const { make, model, year } = req.body;
    res.status(201).json({ message: 'Recipe added successfully', newRecipe });
    // res.json({ success: true, message: 'Car successfully created', data: null });
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).json({ message: 'Error adding recipe' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
