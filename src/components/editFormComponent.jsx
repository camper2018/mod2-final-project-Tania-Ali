import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import '../App.css';
import { v4 as uuidv4 } from 'uuid';
import Loading from './loading';
import FormComponent from './formComponent';

const RecipeForm = ({ unitSystem, toggleUnitSystem, handleSubmitForm, categories }) => {
    const [isFavorite, setFavorite] = useState(false);
    const [error, setError] = useState({});
    const [currentRecipe, setCurrentRecipe] = useState({id: uuidv4(), name: '', favorite: false, method: '', ingredients: [], tags: []});
    const [isLoading, setLoading] = useState(false);
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (response.ok) {
                    const data = await response.json();  
                    const updatedData  = {...data, tags: data.tags|| ['']};
                    setCurrentRecipe(updatedData);
                    setFavorite(data.favorite ? true : false);
                    setLoading(false);

                } else {
                    throw Error(`${response.statusText}: ${response.status}`);
                }
            } catch (err) {
                setLoading(false);
                console.error('Error fetching recipe!', err.message);
                // setError({ ...error, fetchError: err.message });
                setError(`fetchError: ${err.message}`);
            }
        }
        fetchData();
    }, [])
    if (isLoading) {
        return (<div className="page">
            <Loading />
        </div>)
    } else if (error)
    return (
        <FormComponent 
            unitSystem={unitSystem} 
            toggleUnitSystem={toggleUnitSystem}
            categories={categories}  
            handleSubmitForm={handleSubmitForm}
            param={id}
        />
    )
}

export default RecipeForm;
