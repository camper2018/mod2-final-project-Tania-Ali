const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJwt');
const fs = require('fs');
const multer = require('multer');
const tesseract = require('tesseract.js');
const {OpenAI} = require('openai');
const dotenv = require('dotenv');
dotenv.config();
/******** Save a recipe using image *********/
// Unit abbreviations mapping
const unitAbbreviations = {
    pound: "lb",
    pounds: "lb",
    ounce: "oz",
    ounces: "oz",
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    cup: "cup",
    cups: "cup",
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    liter: "L",
    liters: "L",
    milliliter: "mL",
    milliliters: "mL",
    "fluid ounces": "fl oz",
    "fluid ounce": "fl oz",
    pint: "pt",
    pints: "pt",
    quart: "qt",
    quarts: "qt",
    gallon: "gal",
    gallons: "gal",
  };
// Ingredient categories
const ingredientCategories = [
    "Fresh Produce",
    "Dairy and Eggs",
    "Frozen Food",
    "Oil and Condiments",
    "Meat and Seafood",
    "Bakery",
    "Breakfast",
    "Pasta Flour and Rice",
    "Soups and Cans",
    "Beverages",
    "Snacks",
    "Miscellaneous",
];

// Set up OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Function to classify ingredient type based on unit and fallback rules
function classifyIngredientType(unit, ingredientName) {
    const dryUnits = ["lb", "kg", "g", "oz"];
    const wetUnits = ["cup", "fl oz", "mL", "L", "qt", "gal"];
  
    if (dryUnits.includes(unit)) return "dry";
    if (wetUnits.includes(unit)) return "wet";
  
    // Fallback for ambiguous units
    const wetKeywords = ["oil", "milk", "paste", "yogurt", "sauce", "water", "juice", "puree"];
    return wetKeywords.some((keyword) => ingredientName.includes(keyword))
      ? "wet"
      : "dry";
}
// post request for uploading a recipe image
router.post('/upload', upload.single("image"), async (req, res) => {
    const imagePath = req.file?.path;
    try {
      if (!imagePath) {
        return res.status(400).json({ error: "File upload failed" });
      }
  
      // Process image with Tesseract.js to extract text

      const { data } = await tesseract.recognize(imagePath, "eng");
  
      // Create a detailed prompt for OpenAI
      const recipePrompt = `
        Extract the recipe in JSON format from the following text. For each ingredient, include the following properties:
        1. "type": Classify as "dry" for solid ingredients and "wet" for liquid ingredients based on the rules:
           - Units: "lb", "kg", "g", "oz" → "dry".
           - Units: "cup", "fl oz", "mL", "L", "qt", "gal" → "wet".
           - Units: "tbsp", "tsp", "pt" → Use ingredient nature ("dry" for solids, "wet" for liquids/pastes).
        2. "category": Select one category from the following list: ${ingredientCategories.join(", ")}.
        3. Separate "amount" and "unit" as distinct properties from the quantity.
  
        Here is the recipe text:
  
        ${data.text}
  
        Recipe JSON format:
        {
          "recipe": {
            "name": "Recipe Name",
            "ingredients": [
              {
                "item": "Ingredient name",
                "amount": "Amount as a number",
                "unit": "Unit abbreviation (e.g., 'tbsp', 'g')",
                "type": "dry or wet",
                "category": "One of the provided categories"
              }
            ],
            "instructions": [
              "Step 1 description",
              "Step 2 description",
            ]
          }
        }
      `;
  
      const openaiResponse = await openai.chat.completions.create({
        messages: [{ role: "user", content: recipePrompt }],
        model: "gpt-4o-mini",
        max_tokens: 1000,
      });
  
      // Clean up response from OpenAI to ensure it's valid JSON
      let responseText = openaiResponse?.choices?.[0]?.message?.content?.trim();
      if(!responseText) {
         throw new Error("Invalid response from OpenAI: " + JSON.stringify(openaiResponse));
      }
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const recipeJson = JSON.parse(responseText);
      
      // Transform the recipe to the final format
      const transformedRecipe = {
        name: recipeJson.recipe.name,
        ingredients: recipeJson.recipe.ingredients.map((ingredient) => {
        const [amount, unit] = [ingredient.amount, ingredient.unit];
        const type = classifyIngredientType(unit, ingredient.item.toLowerCase());
          return {
            name: ingredient.item.toLowerCase(),
            amount,
            unit,
            type, // "dry" or "wet"
            category: ingredient.category || "Miscellaneous", // Ingredient category
          };
        }),
        method: recipeJson.recipe.instructions
          .map((instruction, index) => `${index + 1}. ${instruction}`)
          .join("\n"), // Add newline after each instruction
      };

      // Send the transformed recipe to the frontend
      console.log("transformedRecipe: ", transformedRecipe);
      res.json(transformedRecipe);
    } catch (error) {
      console.error("Error processing the image:", error.message);
      res.status(500).json({ error: "Failed to process the image" });
    } finally {
      // Clean up the uploaded file
      if (imagePath) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted file: ${imagePath}`);
      }
    }
});
/************************************/

// retrieve recipes created by user 
router.get('/myrecipes', verifyJwt, async function (req, res) {
    const {userId} = req.user;
    try {
        const count = 20;
        const sql = `
      SELECT
      r.id,
      r.name,
      CASE r.favorite
          WHEN 0 THEN false
          WHEN 1 THEN true
      END AS favorite,
      r.method,
      (SELECT username FROM users WHERE id=r.user_id) AS writer,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', i.ingredient_id,
              'name', i.ingredient_name,
              'amount', i.amount,
              'unit', i.unit,
              'type', i.type,
              'category', i.category
          )
      ) AS ingredients,
      (
          SELECT JSON_ARRAYAGG(tag_name)
          FROM tags t
          WHERE t.recipe_id = r.id AND t.tag_name IS NOT NULL
      ) AS tags
    FROM
        recipes r
    LEFT JOIN
        (
            SELECT DISTINCT
                recipe_id,
                ingredient_id,
                ingredient_name,
                amount,
                unit,
                type,
                category
            FROM
                ingredients
        ) i ON r.id = i.recipe_id
        WHERE r.user_id=:userId
    GROUP BY
        r.id, r.name, r.favorite, r.method, writer
    LIMIT :count;
  `
        const [result] = await req.db.query(sql, { count, userId: userId });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching recipes!', err);
        res.status(500).json({ message: `Error fetching recipes: ${err.message}` })
    }
});

// get random recipes of the requested count or limit from database
router.get('/random-recipes/:count?', async function (req, res) {
    try {
        let count = parseInt(req.params.count) || 20;
        const sql = `
      SELECT
      r.id,
      r.name,
      CASE r.favorite
          WHEN 0 THEN false
          WHEN 1 THEN true
      END AS favorite,
      r.method,
      (SELECT username FROM users WHERE id=r.user_id) 
      AS writer,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'id', i.ingredient_id,
              'name', i.ingredient_name,
              'amount', i.amount,
              'unit', i.unit,
              'type', i.type,
              'category', i.category
          )
      ) AS ingredients,
      (
          SELECT JSON_ARRAYAGG(tag_name)
          FROM tags t
          WHERE t.recipe_id = r.id AND t.tag_name IS NOT NULL
      ) AS tags
    FROM
        recipes r
    LEFT JOIN
        (
            SELECT DISTINCT
                recipe_id,
                ingredient_id,
                ingredient_name,
                amount,
                unit,
                type,
                category
            FROM
                ingredients
        ) i ON r.id = i.recipe_id
    GROUP BY
        r.id, r.name, r.favorite, r.method, writer
    ORDER BY
        RAND()
    LIMIT :count;
  `
        const [result] = await req.db.query(sql, { count });
        res.status(200).json(result);
      
        

    } catch (err) {
        console.error('Error fetching recipes!', err);
        res.status(500).json({ message: `Error fetching recipes: ${err.message}` })
    }
});

// get a requested recipe based on search text from database
// the text should either partially match recipe name or any of the recipe tag.
router.get('/search/:searchTerm', async function (req, res) {
    try {
        const searchTerm = (req.params.searchTerm).toLowerCase().trim();
        const searchText = `%${searchTerm}%`;
        const sql = `
      SELECT
          r.id,
          r.name,
          r.favorite,
          r.method,
          (SELECT username FROM users WHERE id=r.user_id) AS writer,
          JSON_ARRAYAGG(JSON_OBJECT(
              'id', i.ingredient_id,
              'name', i.ingredient_name,
              'amount', i.amount,
              'unit', i.unit,
              'type', i.type,
              'category', i.category
          )) AS ingredients,
          (SELECT JSON_ARRAYAGG(tag_name) FROM (SELECT DISTINCT tag_name FROM tags WHERE recipe_id = r.id AND tag_name IS NOT NULL) t) AS tags
      FROM
          recipes r
      LEFT JOIN
          (SELECT DISTINCT recipe_id, ingredient_id, ingredient_name, amount, unit, type, category FROM ingredients) i ON r.id = i.recipe_id
      WHERE
          r.name LIKE :searchText OR r.id IN (SELECT DISTINCT recipe_id FROM tags WHERE tag_name LIKE :searchText)
      GROUP BY
          r.id, r.name, r.favorite, r.method, writer;
  `;
        const [result] = await req.db.query(sql, { searchText });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error searching recipes!', err);
        res.status(500).json({ message: `Error searching recipes: ${err.message}` })
    }
});

// get recipe by id
router.get('/myrecipes/:id', async function (req, res) {
    const recipeId = req.params.id;

    const sql = `SELECT
      r.id,
      r.name,
      r.favorite,
      r.method,
      JSON_ARRAYAGG(JSON_OBJECT('id', i.ingredient_id, 'name', i.ingredient_name, 'amount', i.amount, 'unit', i.unit, 'type', i.type, 'category', i.category)) AS ingredients,
      (SELECT JSON_ARRAYAGG(t.tag_name) FROM (SELECT DISTINCT tag_name FROM tags WHERE recipe_id = r.id AND tag_name IS NOT NULL)t) AS tags
      FROM recipes r
      LEFT JOIN
      (SELECT DISTINCT recipe_id, ingredient_id, ingredient_name, amount, unit, type, category FROM ingredients) i ON r.id = i.recipe_id
      WHERE r.id = :recipeId
      GROUP BY r.id, r.name, r.favorite, r.method
      ;`;
    try {
      const [result] = await req.db.query(sql, { recipeId });
      if (result.length === 0) {
        res.status(404).json({ message: 'Recipe not found' });
      } else {
        res.status(200).json(result[0]);
      }
    } catch(err){
        console.error('Error retrieving recipe!', err);
        res.status(500).json({ message: `Error retrieving recipes: ${err.message}` })
    }
});


// save a recipe

router.post('/myrecipes', verifyJwt, async function (req, res) {
    const recipe = req.body;
    const {userId} = req.user;
    const { name, favorite, method, ingredients, tags } = recipe;
    const recipesQuery = "INSERT INTO recipes SET :recipe;";
    const ingredientsQuery = "INSERT INTO ingredients SET :ingredient;";
    const tagsQuery = "INSERT INTO tags SET :tag;";
    let recipeId;
    try {
        await req.db.beginTransaction();
        try {
            const [result] = await req.db.query(recipesQuery, { recipe: { name, favorite, method, createdAt: new Date(), updatedAt: new Date(), user_id: userId } });
            recipeId = result.insertId;
            await Promise.all(ingredients.map(async (ingredient) => {
                const { name, amount, unit, type, category} = ingredient;
                await req.db.query(ingredientsQuery, { ingredient: { recipe_id: recipeId, ingredient_name: name, amount: amount, unit: unit, type: type, category: category} });
            }))
            await Promise.all(tags.map(async (tag) => {
                await req.db.query(tagsQuery, { tag: { recipe_id: recipeId, tag_name: tag?.trim() } });
            }));
            await req.db.commit();
            res.status(201).json({ message: "Successfully added recipe with id = " + recipeId });
        } catch (err) {
            await req.db.rollback();
            res.status(500).json({ message: `Internal Server! Failed to save recipe with id = ${recipeId}: ${err.message} ` });
        }
    } catch (err) {
        res.status(500).json({ error: `Database connection error:  ${err.message}` });
    }
});

// Edit a recipe
router.put('/myrecipes/:id', verifyJwt, async (req, res) => {
    const recipeId = req.params.id;
    const { name, favorite, method, ingredients, tags } = req.body;
    const updateRecipeQuery = `UPDATE recipes SET name = :name, favorite = :favorite, method = :method, updatedAt = :updatedAt WHERE id = :id;`;
    const deleteIngredientsQuery = `DELETE FROM ingredients WHERE recipe_id = :recipeId`;
    const insertIngredientsQuery = `INSERT INTO ingredients (ingredient_name, amount, unit, type, category, recipe_id) VALUES :ingredientValues;`;
    const deleteTagsQuery = `DELETE FROM tags WHERE recipe_id=:recipeId;`;
    const insertTagsQuery = `INSERT INTO tags (tag_name, recipe_id) VALUES :tagValues;`;
    try {
        await req.db.beginTransaction();
        try {
            await req.db.query(updateRecipeQuery, { name, favorite, method, updatedAt: new Date(), id: recipeId });
            await req.db.query(deleteIngredientsQuery, { recipeId });
            const ingredientValues = ingredients.map(ingredient => [ingredient.name, ingredient.amount, ingredient.unit, ingredient.type, ingredient.category, recipeId]);
            await req.db.query(insertIngredientsQuery, { ingredientValues });
            await req.db.query(deleteTagsQuery, { recipeId });
            const tagValues = tags.map(tag => [tag.trim(), recipeId]);
            await req.db.query(insertTagsQuery, { tagValues });
            await req.db.commit();
            res.status(200).json({ message: 'Update successful' });
        } catch (err) {
            // Rollback transaction if any update fails
            await req.db.rollback();
            // Send error response
            console.error(err);
            res.status(500).json({ error: `Error updating recipe: ${err.message}` });
        }
    } catch (err) {
        // Send error response if unable to start transaction or get connection
        res.status(500).json({ error: `Database connection error: ${err.message}` });
    }
});

// Delete a recipe
router.delete('/myrecipes/:id',verifyJwt, async (req, res) => {
    const recipeId = req.params.id;
    const deleteRecipeQuery = 'DELETE FROM recipes WHERE id = :recipeId';
    try {
        const [result] = await req.db.query(deleteRecipeQuery, { recipeId });
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Recipe not found!' });
        } else {
            res.status(200).json({ message: 'Recipe deleted successfully. ', recipeId })
        }
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ error: `Internal Server Error: ${err.message}` })
    }
});

module.exports = router;
