import React from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { IoIosArrowBack } from "react-icons/io";

const RenderRecipes = ({ recipes, createIngredientsList, handleDeleteRecipes, handleAddToFavorites, handleRemoveFromFavorites }) => {
    const navigate = useNavigate();
    return (
        <React.Fragment>
            <Button className="m-auto ms-0" variant="success" onClick={() => navigate('/')}><IoIosArrowBack size={18} /> Add More</Button>
            <div className="h-75 overflow-scroll">
                {recipes.map(item =>
                    <RenderListItem key={item.id} item={item} isFavorite={item.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} />
                )}
            </div>
            <Button className="mt-2 mx-auto" variant="success" onClick={() => {
                createIngredientsList(recipes);
                navigate('/ingredients-list')
            }}>Generate List</Button>

        </React.Fragment>
    )
};

export default RenderRecipes;