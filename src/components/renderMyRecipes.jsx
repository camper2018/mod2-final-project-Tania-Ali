import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import  Loading  from "./loading";
const MyRecipes = ({ handleAddToFavorites, handleRemoveFromFavorites }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const Navigate = useNavigate();
    console.log("Mounted!")
    
    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/recipes/random-recipes/');
            if (response.ok) {
                const data = await response.json();
                setRecipes(data);
                setLoading(false);
            } else {
                throw Error(`${response.statusText}: ${response.status}`)
            }
        } catch (err) {
            setLoading(false);
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
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    const result = await response.json();
                    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
                    setRecipes(filteredRecipes);
                } else {
                    throw Error(`${response.statusText}: ${response.status}`);
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
        // fetch recipes created by user in alphabetical order(i.e recipes with user_id)
        // http://localhost:5000/myrecipes'
        fetchRecipes();
    }, []);
    if (isLoading) {
        return <Loading />;
    } else
    if (error) {
       return <h2 className="m-auto text-danger">{error}</h2>
    } else {
        return (
            <div className="h-100 pt-5 overflow-scroll">
                <div className="d-flex justify-content-between">
                    <Button variant="success" onClick={()=> { Navigate('/'); location.reload();}}>
                        <IoIosArrowBack/>
                    </Button>
                    <Button variant="success" onClick={() => { Navigate('/add-recipe') }}>
                        Add Recipe&nbsp;
                        <FaPlus />
                    </Button>
                </div>
                {recipes.map((recipe, i) => (
                    <RenderListItem key={i} item={recipe} isFavorite={recipe.favorite} deleteItem={handleDelete} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} handleEdit={() => handleEdit(recipe.id)}/>
                )
                )}
            </div>)
    }
};

export default MyRecipes;