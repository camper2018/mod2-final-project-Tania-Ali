import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "./loading";
import localStore from '../utilities/localStorage';
import useHttp from './useHttp';

const MyRecipes = ({ handleAddToFavorites, handleRemoveFromFavorites }) => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStore.getJwt();
    const navigate = useNavigate();

    // Fetch recipes using useHttp hook
    const [fetchErrorMsg, fetchRecipes] = useHttp('api/recipes/myrecipes', {
        headers: { 'Authorization': `Bearer ${token}` },
    }, (data) => {
        setRecipes(data);
        setIsLoading(false);
        setError(null);
    });
    const handleEdit = async (id) => {
        navigate(`/edit-recipe/${id}`);
    }

    // Delete recipe using useHttp hook
    const [deleteErrorMsg, deleteRecipe] = useHttp(`api/recipes/myrecipes`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    }, (data) => {
        setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe.id !== Number(data.recipeId)));
        setError(null);
    })
    const handleDelete = (recipeId) => {
        if (token) {
            let text = `
        Warning! 
        This action this irreversible!.
        Are you sure you want to delete this recipe?`

            if (confirm(text) == true) {
                setIsLoading(true);
                deleteRecipe(recipeId);
                setIsLoading(false);
            } else {
                return;
            }
        } else {
            setError('Authentication required!');
            setIsLoading(false);
        }
    };
    // fetch recipes if authenticated user
    useEffect(() => {
        if (token) {
            setIsLoading(true);
            fetchRecipes();
            setIsLoading(false);
        } else {
            setError('Authentication required!');
            setIsLoading(false);
        }
    }, []);
    
    // trigger re-render on http error
    useEffect(() => {
        if (fetchErrorMsg) {
            setError(fetchErrorMsg);
        }
        if (deleteErrorMsg) {
            setError(deleteErrorMsg);
        }

    }, [fetchErrorMsg, deleteErrorMsg, /*addErrorMsg*/]);

    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <h2 className="m-auto text-danger">{error}</h2>;
    }
    return (
        <div className="h-100 pt-5 overflow-scroll">
            <div className="d-flex justify-content-between mb-3">
                <Button variant="success" onClick={() => { navigate('/'); window.location.reload(); }}>
                    <IoIosArrowBack />
                </Button>
                <Button variant="warning" onClick={() => { navigate('/add-recipeImage'); }}>
                    Add Image  &nbsp; 
                    <FaPlus />
                </Button>
                <Button variant="success" onClick={() => { navigate('/add-recipe'); }}>
                    Add Recipe&nbsp;
                    <FaPlus />
                </Button>
                
            </div>
            {recipes.length > 0 ? (
                recipes.map((recipe, i) => (
                    <RenderListItem
                        key={i}
                        item={recipe}
                        isFavorite={recipe.favorite}
                        deleteItem={() => handleDelete(recipe.id)}
                        addToFavorites={() => handleAddToFavorites(recipe.id)}
                        removeFromFavorites={() => handleRemoveFromFavorites(recipe.id)}
                        handleEdit={() => handleEdit(recipe.id)}
                    />
                ))
            ) : (
                <p>No recipes available.</p>
            )}
        </div>
    );
}

export default MyRecipes;