const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const fs = require('fs');

app.use(cors());

app.use(express.json());

// get random recipes of the requested count or limit

app.get('/recipes/:limit', async function (req, res) {
  try {
    const recipes = JSON.parse(fs.readFileSync('recipes.json', 'utf-8'));
    const limit = parseInt(req.params.limit);
    const randomIndices = new Set();
    while (randomIndices.size < limit && randomIndices.size < recipes.length) {
      let randomIndex = Math.floor(Math.random() * recipes.length);
      randomIndices.add(randomIndex);
    }
    const randomlySelectedRecipes = [...randomIndices].map(index => recipes[index]);
    res.status(200).json(randomlySelectedRecipes);
  } catch (err) {
    console.error('Error fetching recipes!', err);
    res.status(500).json({ message: 'Error fetching recipes' })
  }
});

// get a requested recipe based on search text
// the text should either partially match recipe name or any of the recipe tag.

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
    const newRecipe = req.body;
    recipes.push(newRecipe);
    fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2))
    res.status(201).json({ message: `Recipe with the name ${newRecipe.name} added successfully`, data: null });
  } catch (err) {
    console.error('Error adding recipe:', err.message);
    res.status(500).json({ message: `Error adding recipe with the name ${newRecipe}` })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
