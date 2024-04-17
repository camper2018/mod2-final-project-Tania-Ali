import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { dryConversionFactors } from '../utilities/addDryIngredients';
import { wetConversionFactors } from '../utilities/addWetIngredients';
import { metricDryConversionFactors } from '../utilities/addDryIngredients';
import { metricWetConversionFactors } from '../utilities/addWetIngredients';
import { isPlural } from '../utilities/findPlural';
import { numericQuantity } from 'numeric-quantity';
import { IoMdClose } from "react-icons/io";
import styles from './formComponent.module.css';
import '../App.css';
import UnitSystemToggle from './toggleSwitch';
import { v4 as uuidv4 } from 'uuid';
import Loading from './loading';

const FormComponent = ({ unitSystem, toggleUnitSystem, categories, handleSubmitForm, param }) => {
    const [recipeName, setRecipeName] = useState('');
    const [method, setMethod] = useState('');
    const [tags, setTags] = useState('');
    const [ingredients, setIngredients] = useState([{ id: uuidv4(), name: '', amount: '0', unit: 'none', category: '', type: 'dry' }]);
    const [errors, setErrors] = useState({
        recipeName: '',
        ingredients: '',
        ingredientErrors: [],
    });
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/api/recipes/myrecipes/${param}`);
            if (response.ok) {
                const data = await response.json();
                const updatedData = { ...data, tags: data.tags || [''] };
                setRecipeName(updatedData.name);
                setMethod(updatedData.method);
                setTags(updatedData.tags || ['']);
                setIngredients(updatedData.ingredients);
                setLoading(false);

            } else {
                throw Error(`${response.statusText}: ${response.status}`);
            }
        } catch (err) {
            setLoading(false);
            console.error('Error fetching recipe!', err.message);
            setErrors({ ...errors, fetchError: err.message });
        }
    }
    useEffect(() => {
        if (param) {
            fetchData();
        }
    }, [param])

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
        const id = uuidv4();
        setIngredients(prevIngredients => ([...prevIngredients, { id: id, name: '', amount: '', unit: 'none', category: '', type: 'dry' }]))
    }
    const handleRemoveFormEl = (id) => {
        const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== id);
        setIngredients(updatedIngredients);
    }
    const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        const updatedIngredients = ingredients.map(ingredient => {
            if (ingredient.id === id) {
                if (name === 'unit') {
                    let type = value.split(" ")[1];
                    let unit = value.split(" ")[0];

                    return { ...ingredient, type: type, unit: unit }
                } else {
                    return { ...ingredient, [name]: value };
                }
            }
            return ingredient;
        });
        setIngredients(updatedIngredients);
    }
    const validateForm = () => {
        const errors = {};

        if (!recipeName.trim()) {
            errors.recipeName = 'Recipe name is required';
        }
        const ingredientErrors = ingredients.map(ingredient => {
            const ingredientError = {};
            if (!ingredient.name) {
                ingredientError.name = 'Ingredient name is required';
            } else if (isPlural(ingredient.name)) {
                ingredientError.name = 'Ingredient name must be singular form.';
            }
            if (!ingredient.amount) {
                ingredientError.amount = 'Amount is required';
            } else if (isNaN(numericQuantity(ingredient.amount))) {
                ingredientError.amount = 'Amount must be a number'
            }
            if (!ingredient.category) {
                ingredientError.category = 'Category is required';
            }
            return ingredientError;
        });
        errors.ingredientErrors = ingredientErrors;
        return errors;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateForm();
        // Access form values from state
        if (Object.keys(errors).length < 2 && errors.ingredientErrors.every(error => Object.keys(error).length === 0)) {
            let tagArray;
            if (typeof tags === 'string') {
               tagArray = tags.split(",");
            } else {
                tagArray = tags;
            }
            const formData = {
                name: recipeName,
                method: method,
                tags: tags? tagArray : [''],
                favorite: false,
                ingredients: ingredients.map(({ id, name, amount, unit, category, type }) => ({
                    name,
                    amount,
                    unit,
                    category,
                    type
                }))
            };
            // if id is passed as param, edit recipe with the id = param, otherwise add recipe
            if (param){
               handleSubmitForm(formData, param)
            } else {
               handleSubmitForm(formData);
            }
            navigate('/my-recipes');
        } else {
            console.error("Error:", errors);
            setErrors(errors);
        }
    }
    if (isLoading) {
        return (<div className="page">
            <Loading />
        </div>)
    }
    if (errors.fetchError) {
        return <h3 className="mt-5 text-center text-danger">{errors.fetchError}</h3>
    } else if (errors.updateError) {
        return <h3 className="mt-5 text-center text-danger">{errors.updateError}</h3>
    } else {
        return (
            <div className={styles.container + " background"}>
                <div className={styles.subContainer}>
                    <div className={styles.form}>
                        <div className={styles.header}>
                            <span className="ms-1"><h3>{recipeName? recipeName: 'Create Your Recipe'}</h3></span>
                        </div>
                        <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={toggleUnitSystem} />
                        <Form
                            onSubmit={handleSubmit}
                            id="addRecipeForm"
                        >
                            <Form.Group className="my-3" controlId="recipeForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Recipe Name"
                                    autoFocus
                                    autoComplete='on'
                                    name="recipeName"
                                    value={recipeName}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                    isInvalid={!!errors.recipeName}

                                />
                                <Form.Control.Feedback type="invalid">{errors.recipeName}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="recipeForm.ControlTextarea1"
                            >
                                <Form.Label>Method</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="method"
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    isInvalid={!!errors.method}
                                />
                                <Form.Control.Feedback type="invalid">{errors.method}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="recipeForm.ControlInput2">
                                <Form.Label>Tag/ Tags</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="vegan, gluten-free, dairy-free, seafood,egg-free"
                                    name="tags"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="recipeForm.ControlInput3">
                                <Form.Label>Ingredients</Form.Label>
                                <Form.Control
                                    disabled={true}
                                    className="d-none"
                                    isInvalid={errors.ingredients}
                                />
                                <Form.Control.Feedback type="invalid">{errors.ingredients}</Form.Control.Feedback>
                                <Button className={styles.addIngredientBtn} variant="secondary" onClick={handleAddFormEl}>ADD</Button>
                                {ingredients.map(({ id, name, amount, unit, category }, i) => {
                                    return (
                                        <div key={i} className={styles.ingredientsContainer} name="ingredients">
                                            <Form.Control
                                                type="text"
                                                placeholder="Name"
                                                className='m-1'
                                                name="name"
                                                value={name}
                                                onChange={(e) => handleInputChange(id, e)}
                                                isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.name}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.name}</Form.Control.Feedback>
                                            <Form.Control
                                                type="text"
                                                placeholder="Amount"
                                                className='m-1'
                                                name="amount"
                                                value={amount}
                                                onChange={(e) => handleInputChange(id, e)}
                                                isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.amount}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.amount}</Form.Control.Feedback>
                                            <Form.Select
                                                aria-label="select unit for ingredient"
                                                name="unit"
                                                className='m-1'
                                                value={unit}
                                                onChange={(e) => handleInputChange(id, e)}
                                            >
                                                <option key="none dry" value={"none" + " " + "dry"}>Unit</option>
                                                {optionsHTML}
                                            </Form.Select>
                                            <Form.Select
                                                aria-label="select category for ingredient"
                                                name="category"
                                                className='m-1'
                                                value={category}
                                                onChange={(e) => handleInputChange(id, e)}
                                                isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.category}
                                            >
                                                <option key="none" value="none">Category</option>
                                                {optionsHTMLForCategory}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.category}</Form.Control.Feedback>
                                            {ingredients.length &&
                                                <div className="text-center m-3 px-1 border border-danger rounded " onClick={() => handleRemoveFormEl(id)} >
                                                    Delete
                                                    <IoMdClose fill="red" className={styles.deleteIcon} size={36} />
                                                </div>}
                                        </div>
                                    )
                                })
                                }
                            </Form.Group>

                        </Form>
                        <div className={styles.btnContainer}>
                            <Button className={styles.btnClose} variant="secondary" onClick={() => { navigate('/') }}>
                                Cancel
                            </Button>
                            <Button type="submit" className={styles.btnSubmit} variant="primary" form="addRecipeForm">
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FormComponent;


