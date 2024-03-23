import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { dryConversionFactors } from '../utilities/addDryIngredients';
import { wetConversionFactors } from '../utilities/addWetIngredients';
import { metricDryConversionFactors } from '../utilities/addDryIngredients';
import { metricWetConversionFactors } from '../utilities/addWetIngredients';
import { isPlural } from '../utilities/findPlural';
import { numericQuantity } from 'numeric-quantity';
import { IoMdClose } from "react-icons/io";
import styles from './addRecipeForm.module.css';
import '../App.css';
import UnitSystemToggle from './toggleSwitch';
import { v4 as uuidv4 } from 'uuid';
const RecipeForm = ({ unitSystem, toggleUnitSystem, addRecipe, categories }) => {
    const [isFavorite, setFavorite] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentRecipe, setCurrentRecipe] = useState({id: uuidv4(), name: '', favorite: false, method: '', ingredients: [], tags: []});
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
                if (response.ok) {
                    const data = await response.json();  
                    const updatedData  = {...data, tags: data.tags|| ['']};
                    console.log("fetched data:", updatedData);
                    setCurrentRecipe(updatedData);
                    setFavorite(data.favorite ? true : false);

                } else {
                    throw Error(response.statusText);
                }
            } catch (err) {
                console.error('Error fetching recipe!', err.message);
                setErrors({ ...errors, fetchError: err.message });
            }
        }
        fetchData();
    }, [])
    const handleAddToFavorite = () => {
        setFavorite(true);
    };
    const handleRemoveFromFavorites = () => {
        setFavorite(false);
    };
    const createOptionHTMLForUnits = (unitSystem) => {
        const html = [];
        let conversionFactorsForDry;
        let conversionFactorsForWet;
        if (unitSystem === 'customary') {
            conversionFactorsForDry = dryConversionFactors;
            conversionFactorsForWet = wetConversionFactors;
        } else {
            conversionFactorsForDry = metricDryConversionFactors;
            conversionFactorsForWet = metricWetConversionFactors;
        }
        let htmlForDry = Object.keys(conversionFactorsForDry).map((factor, i) => (<option key={factor + 'dry' + i} value={factor + " " + "dry"}>{factor}&nbsp; *dry</option>));
        let htmlForWet = Object.keys(conversionFactorsForWet).map((factor, j) => (<option key={factor + 'wet' + j} value={factor + " " + "wet"}>{factor}&nbsp; *liquid</option>));
        html.push(htmlForDry, htmlForWet);
        return html;

    }
    const optionsHTML = createOptionHTMLForUnits(unitSystem);
    const createOptionHTMLForCategory = () => {
        return Object.keys(categories).map(category => (
            <option key={category} value={category}>{category}</option>)
        );

    };
    const optionsHTMLForCategory = createOptionHTMLForCategory();

    const handleAddFormEl = () => {
        // adds a form field for adding an ingredient to the recipe.
        setCurrentRecipe(prevRecipe => {
            const updatedIngredients = [...prevRecipe.ingredients]
            const newIngredient = { id: uuidv4(), name: '', amount: '0', unit: 'none', category: '', type: 'dry' };
            return { ...prevRecipe, ingredients: [...updatedIngredients,newIngredient ] };
        }) 
        
    }
    const handleRemoveFormEl = (id) => {
        // delete an ingredient form field
        setCurrentRecipe((prevRecipe)=> {
            const updatedIngredients = prevRecipe.ingredients.filter((ingredient) => ingredient.id !== id);
            return { ...prevRecipe, ingredients: updatedIngredients };
        })
    }
    
    const handleChangeIngredient = (e, type, ingredient, index) => {
        const value = e.target.value;
         // updates an ingredient on change in input
        let updatedIngredient;
        if (type === 'unit'){
            const ingredientUnit = value.split(" ")[0];
            const ingredientType = value.split(" ")[1];
            updatedIngredient  = { ...ingredient, unit: ingredientUnit, type: ingredientType };
        } else {
           updatedIngredient = { ...ingredient, [type]: e.target.value };
        }
        const updatedIngredients = currentRecipe.ingredients.map((ingredient, i) => i === index ? updatedIngredient : ingredient);
        setCurrentRecipe(prevRecipe => ({...prevRecipe, ingredients: updatedIngredients}));
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // form validation
        if (currentRecipe.ingredients.length === 0){
            alert('Recipe must have ingredients!');
            return;
        }
        if (!currentRecipe.name.trim()) {
            setErrors({ ...errors, name: 'Recipe name is required!' });
            return;
        }

        const ingredientErrors = currentRecipe.ingredients.map(ingredient => {
            const errors = {};
            if (!ingredient.name.trim()) {
                errors.name = 'Ingredient name is required';
            } else if (isPlural(ingredient.name)) {
                errors.name = 'Please enter ingredient name in singular form.';
            }
            if (!ingredient.amount.trim()) {
                errors.amount = 'Amount is required';
            } else if (isNaN(numericQuantity(ingredient.amount))) {
                errors.amount = 'Amount must be a number';
            }
            if (! ingredient.category || ingredient.category === 'none'){
                errors.category = 'Category is required';
            }
            return errors;
        });

        if (ingredientErrors.some(error => Object.keys(error).length !== 0)) {
            setErrors({ ...errors, ingredientErrors });
            return;
        }
         // saves updated recipe in the database
        try {
            const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(currentRecipe),
            })
            if (response.ok) {
                console.log("currentRecipe:", currentRecipe);
                alert(`Successfully updated ${currentRecipe.name} recipe.`);
                console.log("currentRecipe in submit:", currentRecipe)
                navigate('/my-recipes');
            } else {
                throw Error(response.statusText);
            }
        } catch (err) {
            console.error(err.message);
            setErrors({ ...errors, updateError: err.message })
        }
    }

    if (errors.fetchError) {
        return <h3 className="mt-5 text-center text-danger">{errors.fetchError}</h3>
    } else if (errors.updateError) {
        return <h3 className="mt-5 text-center text-danger">{errors.updateError}</h3>
    }
    return (
        <React.Fragment>
            <div className={styles.container + " background"}>
                <div className={styles.subContainer}>
                    <div className={styles.form}>
                        <div className={styles.header}>
                            <span className="me-1">
                                {isFavorite ? <FaStar size={30} fill={"orange"} onClick={handleRemoveFromFavorites} /> :
                                    <CiStar size={34} onClick={handleAddToFavorite} />
                                }
                            </span>
                            <span className="ms-1"><h3>Edit Recipe: {currentRecipe.name}</h3></span>
                        </div>
                        <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={toggleUnitSystem} />
                        <Form onSubmit={handleSubmit}
                            id="editRecipeForm"
                        >
                            <Form.Group className="my-3" controlId="recipeForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoFocus
                                    autoComplete='on'
                                    placeholder='Name'
                                    name="name"
                                    value={currentRecipe.name}
                                    onChange={(e) => setCurrentRecipe(prevRecipe => ({ ...prevRecipe, name: e.target.value }))}
                                    isInvalid={!!errors.name}

                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="recipeForm.ControlTextarea1"
                            >
                                <Form.Label>Method</Form.Label>
                                <Form.Control as="textarea" name="method" value={currentRecipe.method} onChange={(e) => setCurrentRecipe({ ...currentRecipe, method: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="recipeForm.ControlInput2">
                                <Form.Label>Tag/ Tags</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="vegan, gluten-free, dairy-free, seafood,egg-free"
                                    name="tags"
                                    value={currentRecipe.tags}
                                    onChange={(e) => setCurrentRecipe(prevRecipe => ({ ...prevRecipe, tags: e.target.value? e.target.value.split(","): [e.target.value ] }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="recipeForm.ControlInput3">
                                <Form.Label>Ingredients</Form.Label>
                                <Button className={styles.addIngredientBtn} variant="secondary" onClick={handleAddFormEl}>ADD</Button>
                                {currentRecipe.ingredients?.map((ingredient, i) => (

                                    <div key={ingredient.id} className={styles.ingredientsContainer} name="ingredients" >
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            className='m-1'
                                            value={ingredient.name}
                                            onChange={(e)=> handleChangeIngredient(e, 'name', ingredient, i)}
                                            isInvalid={!!errors.ingredientErrors?.[i]?.name}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.ingredientErrors?.[i]?.name}</Form.Control.Feedback>
                                        <Form.Control
                                            type="text"
                                            placeholder="Amount"
                                            className='m-1'
                                            value={ingredient.amount}
                                            onChange={(e)=> handleChangeIngredient(e, 'amount', ingredient, i)}
                                            isInvalid={!!errors.ingredientErrors?.[i]?.amount}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.ingredientErrors?.[i]?.amount}</Form.Control.Feedback>
                                        <Form.Select
                                            value={ingredient.unit}
                                            onChange={(e)=> handleChangeIngredient(e, 'unit', ingredient, i)}
                                            aria-label="select unit for ingredient"
                                            className='m-1'>
                                            <option key="none dry" value={"none" + " " + "dry"}>Unit</option>
                                            {optionsHTML}
                                        </Form.Select>
                                        <Form.Select
                                            value={ingredient.category}
                                            onChange={(e)=> handleChangeIngredient(e, 'category', ingredient, i)}
                                            aria-label="select category for ingredient"
                                            className='m-1'
                                            isInvalid={!!errors.ingredientErrors?.[i]?.category}
                                            >
                                            <option key="none" value="none">Category</option>
                                            {optionsHTMLForCategory}
                                            
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errors.ingredientErrors?.[i]?.category}</Form.Control.Feedback>

                                        {currentRecipe.ingredients.length &&
                                            <div className="text-center m-3 px-1 border border-danger rounded " onClick={() => handleRemoveFormEl(ingredient.id)} >
                                                Delete
                                                <IoMdClose fill="red" className={styles.deleteIcon} size={36} onClick={() => handleRemoveFormEl(ingredient.id)} />
                                            </div>}
                                    </div>
                                ))}
                                
                            </Form.Group>

                        </Form>
                        <div className={styles.btnContainer}>
                            <Button className={styles.btnClose} variant="secondary" onClick={() => { navigate('/') }}>
                                Cancel
                            </Button>
                            <Button type="submit" className={styles.btnSubmit} variant="primary" form="editRecipeForm">
                                Save
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>);
}

export default RecipeForm;
