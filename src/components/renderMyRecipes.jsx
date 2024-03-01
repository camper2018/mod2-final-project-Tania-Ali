import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa";
const MyRecipes = ({ handleAddToFavorites, handleRemoveFromFavorites }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const Navigate = useNavigate();
    console.log("Mounted!")
    const fetchRecipes = async () => {
        try {
            const response = await fetch('http://localhost:5000/recipes');
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
                console.log("my recipes:", data)
            }
        } catch (err) {
            console.error("Error retrieving recipes:", err);
            setError(err.message);
        }
    }
    const handleDelete = async (id) => {
        let text = `
       Warning! 
       This action this irreversible!.
       Are you sure you want to delete this recipe?`

        if (confirm(text) == true) {
            try {
                const response = await fetch(`http://localhost:5000/recipes/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    const result = await response.json();
                    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
                    setRecipes(filteredRecipes);
                } else {
                    throw Error(response.statusText);
                }
            } catch (err) {
                console.error('Error deleting a recipe with id of ' + id, err);
                setError(err.message);
            }
        } else {
            return;
        }
    };
    const handleEdit = async (id) => {
         Navigate(`/edit-recipe/${id}`);
    }
    useEffect(() => {
        // fetch recipes created by user (i.e recipes with user_id)
        // http://localhost:5000/myrecipes'
        fetchRecipes();
    }, []);

    if (error) {
        return <h3 className="m-auto text-danger">{error}</h3>
    }
    return (
        <div className="h-100 pt-5 overflow-scroll">
            <Button  variant="success" onClick={() => {Navigate('/add-recipe') }}>
                           Add Recipe&nbsp;
                           <FaPlus />
                        </Button>
            {recipes.map((recipe, i) => (
                <RenderListItem key={i} item={recipe} isFavorite={recipe.favorite} deleteItem={handleDelete} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} handleEdit={() => handleEdit(recipe.id)} />
            )

            )}
        </div>)

};

export default MyRecipes;