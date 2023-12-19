import React from 'react';
import {useNavigate} from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';

const RenderRecipes = ({recipes, createIngredientsList, handleDeleteRecipes,handleAddToFavorites, handleRemoveFromFavorites/*, unitSystem, toggleUnitSystem*/}) => {
    const navigate = useNavigate();
    return (
        <React.Fragment>
            {recipes.map(item =>
                <RenderListItem key={item.id} item={item} isFavorite={item.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} />
            )}
            <Button className="m-auto" variant="success" onClick={() => { 
                createIngredientsList(recipes); 
                navigate('/ingredients-list')
            }}>Generate List</Button>

        </React.Fragment>
    )
};

export default RenderRecipes;