import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { v4 as uuidv4 } from 'uuid';
import styles from './addRecipe.module.css';
import '../App.css';

const RecipeForm = ({ unitSystem, addRecipe, categories }) => {
    const uuid = uuidv4();
    const [isFavorite, setFavorite] = useState(false);
    const [htmlForAddItem, setHTML] = useState([{ id: uuid }]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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
        // adds a form field for taking user input for adding an ingredient / item to the recipe ingredients.
        const id = uuidv4();
        setHTML([...htmlForAddItem, { id: id }]);
    }
    const handleRemoveFormEl = (id) => {
        // removes a form field for taking user input for adding an ingredient / item to the recipe ingredients.
        // const htmlList = [...htmlForAddItem];
        // htmlList.splice(index, 1);
        const htmlList = htmlForAddItem.filter(html => html.id !== id);
        setHTML(htmlList);
    }
    const handleItemName = (e) => {
        let name = e.target.value;
        if (isPlural(name)) {
            setErrors({ ...errors, itemName: 'Please enter ingredient name in singular form!' });
        } else if (name === '') {
            setErrors({ ...errors, itemName: 'Please enter ingredient name!' });
        } else {
            setErrors({ ...errors, itemName: null })
        }
    }
    const handleItemAmount = (e) => {
        if (isNaN(numericQuantity(e.target.value))) {
            setErrors({ ...errors, itemAmount: 'Please enter a valid numeric amount!' });
        } else {
            setErrors({ ...errors, itemAmount: null });
        }
    }
    const handleName = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, name: 'Recipe name is required!' });
        } else {
            setErrors({ ...errors, name: null });
        }
    }

    return (
        <React.Fragment>
            <div className={styles.container  + " background"}>
            <div className={styles.subContainer}>
                <div className={styles.form}>
                    <div className={styles.header}>
                        <span className="me-1">
                            {isFavorite ? <FaStar size={30} fill={"orange"} onClick={handleRemoveFromFavorites} /> :
                                <CiStar size={34} onClick={handleAddToFavorite} />
                            }
                        </span>
                        <span className="ms-1"><h3>Create Your Recipe Here</h3></span>
                    </div>
                    <Form onSubmit={(e) => {
                        addRecipe(e, isFavorite, errors);
                        navigate('/');
                    }}
                        id="addRecipeForm"
                    >
                        <Form.Group className="my-3" controlId="recipeForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Recipe Name"
                                autoFocus
                                autoComplete='on'
                                name="name"
                                isInvalid={!!errors.name}
                                onBlur={handleName}

                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        
                        <Form.Group
                            className="mb-3"
                            controlId="recipeForm.ControlTextarea1"
                        >
                            <Form.Label>Method</Form.Label>
                            <Form.Control as="textarea" name="method" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput2">
                            <Form.Label>Tag/ Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="vegan, gluten-free, dairy-free, seafood,egg-free"
                                name="tags"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput3">
                            <Form.Label>Ingredients</Form.Label>
                            <Button className={styles.addIngredientBtn} variant="secondary" onClick={handleAddFormEl}>ADD</Button>
                            {htmlForAddItem.map(html => (
                                <div key={html.id} className={styles.ingredientsContainer} name="ingredients" >
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        className='m-1'
                                        name="ingredientName"
                                        isInvalid={!!errors.itemName}
                                        onBlur={handleItemName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.itemName}</Form.Control.Feedback>
                                    <Form.Control
                                        type="text"
                                        placeholder="Amount"
                                        className='m-1'
                                        name="ingredientAmount"
                                        isInvalid={!!errors.itemAmount}
                                        onBlur={handleItemAmount}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.itemAmount}</Form.Control.Feedback>
                                    <Form.Select aria-label="select unit for ingredient" name="ingredientUnit"  className='m-1'>
                                        <option key="none dry" value={"none" + " " + "dry"}>Unit</option>
                                        {optionsHTML}
                                    </Form.Select>
                                    <Form.Select aria-label="select category for ingredient" name="ingredientCategory"  className='m-1'>
                                        <option key="none" value="none">Category</option>
                                        {optionsHTMLForCategory}
                                    </Form.Select>

                                    {htmlForAddItem.length > 1 &&
                                        <div className="text-center m-3 px-1 border border-danger rounded " onClick={() => handleRemoveFormEl(html.id)} >
                                            Delete
                                            <IoMdClose fill="red" className={styles.deleteIcon} size={36} onClick={() => handleRemoveFormEl(html.id)} />
                                        </div>}
                                </div>
                            ))
                            }
                        </Form.Group>
                        
                    </Form>
                    <div className={styles.btnContainer}>
                        <Button className={styles.btnClose} variant="secondary" onClick={() => {navigate('/') }}>
                            Cancel
                        </Button>
                        <Button type="submit" className={styles.btnSubmit} variant="primary" form="addRecipeForm">
                            Save
                        </Button>
                    </div>
                </div>

            </div>
            </div>
        </React.Fragment>);
}

export default RecipeForm;
