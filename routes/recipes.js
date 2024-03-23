const express = require('express');
const router = express.Router();

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
        r.id, r.name, r.favorite, r.method
    ORDER BY
        RAND()
    LIMIT :count;
  `
        const [result] = await req.db.query(sql, { count });
        console.log(result)
        res.status(200).json(result);

    } catch (err) {
        console.error('Error fetching recipes!', err);
        res.status(500).json({ message: 'Error fetching recipes' })
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
          r.id, r.name, r.favorite, r.method;
  `;
        const [result] = await req.db.query(sql, { searchText });
        res.status(200).json(result);
    } catch (err) {
        console.error('Error searching recipes!', err);
        res.status(500).json({ message: 'Error searching recipes' })
    }
});

// get recipe by id
router.get('/:id', async function (req, res) {
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

    const [result] = await req.db.query(sql, { recipeId });
    if (result.length === 0) {
        res.status(404).json({ message: 'Recipe not found' });
    } else {
        res.json(result[0]);
    }
});

// save a recipe
router.post('/', async function (req, res) {
    const recipe = req.body;
    const { name, favorite, method, ingredients, tags } = recipe;
    const recipesQuery = "INSERT INTO recipes SET :recipe;";
    const ingredientsQuery = "INSERT INTO ingredients SET :ingredient;";
    const tagsQuery = "INSERT INTO tags SET :tag;";
    let recipeId;
    try {
        await req.db.beginTransaction();
        try {
            const [result] = await req.db.query(recipesQuery, { recipe: { name, favorite, method } });
            recipeId = result.insertId;
            await Promise.all(ingredients.map(async (ingredient) => {
                const { name, amount, unit, type, category } = ingredient;
                await req.db.query(ingredientsQuery, { ingredient: { recipe_id: recipeId, ingredient_name: name, amount: amount, unit: unit, type: type, category: category } });
            }))
            await Promise.all(tags.map(async (tag) => {
                await req.db.query(tagsQuery, { tag: { recipe_id: recipeId, tag_name: tag?.trim() } });
            }));
            await req.db.commit();
            res.status(201).json({ message: "Successfully added recipe with id = " + recipeId });
        } catch (err) {
            await req.db.rollback();
            res.status(500).json({ message: "Internal Server! Failed to save recipe with id = " + recipeId });
        }
    } catch (err) {
        console.log(recipeId);
        res.status(500).json({ error: 'Database connection error' + err });
    }
});

// Edit a recipe
router.put('/:id', async (req, res) => {
    const recipeId = req.params.id;
    const { name, favorite, method, ingredients, tags } = req.body;
    const updateRecipeQuery = `UPDATE recipes SET name = :name, favorite = :favorite, method = :method WHERE id = :id;`;
    const deleteIngredientsQuery = `DELETE FROM ingredients WHERE recipe_id = :recipeId`;
    const insertIngredientsQuery = `INSERT INTO ingredients (ingredient_name, amount, unit, type, category, recipe_id) VALUES :ingredientValues;`;
    const deleteTagsQuery = `DELETE FROM tags WHERE recipe_id=:recipeId;`;
    const insertTagsQuery = `INSERT INTO tags (tag_name, recipe_id) VALUES :tagValues;`;
    try {
        await req.db.beginTransaction();
        try {
            await req.db.query(updateRecipeQuery, { name, favorite, method, id: recipeId });
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
            res.status(500).json({ error: 'Error updating recipe: ' + err });
        }
    } catch (err) {
        // Send error response if unable to start transaction or get connection
        res.status(500).json({ error: 'Database connection error' });
    }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
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
        console.error('Error deleting recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
});

module.exports = router;
