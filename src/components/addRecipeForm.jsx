import React, { useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import styles from './addRecipeForm.module.css';
import '../App.css';
import UnitSystemToggle from './toggleSwitch';
const RecipeForm = ({ unitSystem, toggleUnitSystem, addRecipe, categories }) => {
    const uuid = uuidv4();
    const [errors, setErrors] = useState({
        recipeName: '',
        ingredients: '',
        ingredientErrors: [],
    });
    const [recipeName, setRecipeName] = useState('');
    const [method, setMethod] = useState('');
    const [tags, setTags] = useState('');
    const [ingredients, setIngredients] = useState([{ id: uuid, ingredientName: '', ingredientAmount: '', ingredientUnit: '', ingredientCategory: '' }]);
    const navigate = useNavigate();
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
        setIngredients([...ingredients, { id: id, ingredientName: '', ingredientAmount: '', ingredientUnit: '', ingredientCategory: '' }]);
      }
    
      const handleRemoveFormEl = (id) => {
        const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== id);
        setIngredients(updatedIngredients);
      }
    
      const handleInputChange = (id, e) => {
        const { name, value } = e.target;
        const updatedIngredients = ingredients.map(ingredient => {
          if (ingredient.id === id) {
            if (name === 'ingredientUnit'){
              let type = value.split(" ")[1];
              let unit = value.split(" ")[0];
             
              return {...ingredient, ingredientType: type, ingredientUnit: unit }
            }
            return { ...ingredient, [name]: value };
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
       
        // Add more validation for other fields if needed
        const ingredientErrors = ingredients.map(ingredient => {
            const ingredientError = {};
            if (!ingredient.ingredientName) {
              ingredientError.ingredientName = 'Ingredient name is required';
            } else if (isPlural(ingredient.ingredientName)){
              ingredientError.ingredientName = 'Ingredient name must be singular form.';
            }
            if (!ingredient.ingredientAmount) {
              ingredientError.ingredientAmount = 'Amount is required';
            } else if (isNaN(numericQuantity(ingredient.ingredientAmount))) {
                ingredientError.ingredientAmount = 'Amount must be a number'
            }
            if (!ingredient.ingredientCategory) {
                ingredientError.ingredientCategory = 'Category is required';
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
            const formData = {
                name: recipeName,
                method: method,
                tags: tags? tags.split(",") : [],
                ingredients: ingredients.map(({ id, ingredientName, ingredientAmount, ingredientUnit, ingredientCategory, ingredientType }) => ({
                    name: ingredientName,
                    amount: ingredientAmount,
                    unit: ingredientUnit,
                    category: ingredientCategory,
                    type: ingredientType
                }))
            };
            console.log(formData);
            addRecipe(formData);
            navigate("..")
        } else {
            console.log("Errors:", errors);
            setErrors(errors);
        }
      }
    return (
        <React.Fragment>
            <div className={styles.container  + " background"}>
            <div className={styles.subContainer}>
                <div className={styles.form}>
                    <div className={styles.header}>
                        <span className="ms-1"><h3>Create Your Recipe Here</h3></span>
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
                            {ingredients.map(({ id, ingredientName, ingredientAmount, ingredientUnit, ingredientCategory }, i) => {
                                return  (
                                <div key={i} className={styles.ingredientsContainer} name="ingredients">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        className='m-1'
                                        name="ingredientName"
                                        value={ingredientName}
                                        onChange={(e) => handleInputChange(id, e)}
                                        isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.ingredientName}
                                    />
                                     <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.ingredientName}</Form.Control.Feedback>
                                    <Form.Control
                                        type="text"
                                        placeholder="Amount"
                                        className='m-1'
                                        name="ingredientAmount"
                                        value={ingredientAmount}
                                        onChange={(e) => handleInputChange(id, e)}
                                        isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.ingredientAmount}
                                    />
                                     <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.ingredientAmount}</Form.Control.Feedback>
                                    <Form.Select 
                                       aria-label="select unit for ingredient" 
                                       name="ingredientUnit"  
                                       className='m-1'
                                       value={ingredientUnit}
                                       onChange={(e)=> handleInputChange(id, e)}
                                       >
                                        <option key="none dry" value={"none" + " " + "dry"}>Unit</option>
                                        {optionsHTML}
                                    </Form.Select>
                                    <Form.Select 
                                        aria-label="select category for ingredient" 
                                        name="ingredientCategory"  
                                        className='m-1'
                                        value={ingredientCategory}
                                        onChange={(e)=> handleInputChange(id, e)}
                                        isInvalid={errors.ingredientErrors[i] && !!errors.ingredientErrors[i]?.ingredientCategory}
                                        >
                                        <option key="none" value="none">Category</option>
                                        {optionsHTMLForCategory}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{errors.ingredientErrors[i] && errors.ingredientErrors[i]?.ingredientCategory}</Form.Control.Feedback>
                                    {ingredients.length > 1 &&
                                        <div className="text-center m-3 px-1 border border-danger rounded " onClick={() => handleRemoveFormEl(id)} >
                                            Delete
                                            <IoMdClose fill="red" className={styles.deleteIcon} size={36} />
                                        </div>}
                                </div>
                            )})
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

