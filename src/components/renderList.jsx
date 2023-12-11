// import data from '../data';
import React, { useState, useEffect } from 'react';
import styles from './renderList.module.css';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { numericQuantity } from 'numeric-quantity';
import { getUnitSystemForWet } from '../utilities/addWetIngredients';
import { getUnitSystemForDry } from '../utilities/addDryIngredients';
import { addDryIngredients } from '../utilities/addDryIngredients';
import { addWetIngredients } from '../utilities/addWetIngredients';
import { convertCustomaryToMetric } from '../utilities/convertUnitSystem';
import { convertMetricToCustomary } from '../utilities/convertUnitSystem';
import { findUnitSystem } from '../utilities/convertUnitSystem';
import GroceryList from './renderGroceryList.jsx';
import UnitSystemToggle from './form';
import RecipesDropdown from './dropdownForRecipes';
import CategoriesDropdown from './dropdownForCategories';
import FinalList from './renderFinalList';
import RecipeForm from './addRecipeForm';
import { v4 as uuidv4 } from 'uuid';
import SearchComponent from './searchBar';

const DisplayList = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    const [recipes, setRecipes] = useState(data ? data : []);
    const [favorites, setFavorites] = useState([]);
    const [groceries, setGroceries] = useState({});
    const [currentComponent, setComponent] = useState('dropdown');
    const [unitSystem, setUnitSystem] = useState('customary');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState({ 'Fresh Produce': [], 'Dairy and Eggs': [], 'Frozen Food': [], 'Oil and Condiments': [], 'Meat and Seafood': [], 'Bakery': [], 'Breakfast': [], 'Pasta Flour and Rice': [], 'Soups and Cans': [], 'Beverages': [], 'Snacks': [], 'Miscellaneous': [] });
    const [itemsCountInCategories, setItemCount] = useState(0);
    const [searchedRecipes, setSearchedRecipes] = useState([]);

    const handleCategorySelect = (eventKey) => {
        setSelectedCategory(eventKey);
    };
    const handleCategorization = (e) => {
        let id = e.target.id;
        if (id && selectedCategory) {
            let categoryContainer = categories[selectedCategory];
            setCategories({ ...categories, [selectedCategory]: [...categoryContainer, groceries[id]] });
            e.target.style.display = 'none';
            setItemCount((prop) => prop + 1);
        } else {
            alert('Please select a category to add items in!')
        }

    }
    const handleFinalList = () => {
        if (itemsCountInCategories < Object.keys(groceries).length) {
            alert("Please select category for all items");
        } else {
            // render final list based on categories array
            setComponent('final list');
        }


    }
    const convertUnitSystemOfRecipes = async (selectedSystem, dataArray) => {
        setUnitSystem(selectedSystem);
        let convertUnitSystem = selectedSystem === 'customary' ? convertMetricToCustomary : convertCustomaryToMetric;
        let dataInOneUnitSystem = await dataArray.map(data => {
            if (findUnitSystem(data) !== selectedSystem) {
                data.ingredients = convertUnitSystem(data.ingredients);
            }
            return data;
        })
        setRecipes(dataInOneUnitSystem);
    };
    useEffect(() => {
        convertUnitSystemOfRecipes(unitSystem, recipes);
        setFavorites(recipes.filter(item => item.favorite));
    }, []);

    const handleDeleteRecipes = (id) => {
        let filteredSearchedRecipes = searchedRecipes.filter(recipe => recipe.id !== id);
        setSearchedRecipes(filteredSearchedRecipes);
        let filteredRecipes = recipes.filter(recipe => recipe.id !== id);
        setRecipes(filteredRecipes);
    };
    /*    Local Storage functions   */
    const addToStorage = (obj) => {
        // add new item to the local storage data array 
        // if local storage is empty, the data would be undefined
        const dataCopy = data ? data : [];
        dataCopy.push(obj);
        localStorage.setItem("data", JSON.stringify(dataCopy));
    }
    const updateLocalStorage = (obj) => {
        const dataCopy = data ? data : [];
        const updatedData = dataCopy.filter(item => item.id !== obj.id);
        updatedData.push(obj);
        localStorage.setItem("data", JSON.stringify(updatedData));
    }
    /************************************ */
    const handleAddToFavorites = (recipe) => {
        recipe.favorite = true;
        setFavorites([...favorites, recipe]);
        // update local storage
        updateLocalStorage(recipe);

    };
    const handleRemoveFromFavorites = (recipe) => {
        recipe.favorite = false;
        let updatedFavorites = favorites.filter(item => item.id !== recipe.id)
        setFavorites(updatedFavorites);
        updateLocalStorage(recipe);
    };

    const handleUnitSystemToggle = (e) => {
        let selectedSystem = e.target.checked ? 'metric' : 'customary';
        convertUnitSystemOfRecipes(selectedSystem, recipes);
    }
    const handleSelectMenu = (eventKey) => {
        if (eventKey === 'favorites') {
            setRecipes([...favorites]);
        } else {
            let count = eventKey;
            const indices = new Set();
            while (indices.size < count && indices.size < recipes.length) {
                let randomIndex = Math.floor(Math.random() * recipes.length);
                indices.add(randomIndex);
            }
            const selectedRecipes = [...indices].map(index => recipes[index]);
            setRecipes(selectedRecipes);
        }

        setComponent('recipes');

    }
    const createIngredientsList = () => {

        // extract ingredients from recipes as ingredient's array
        const ingredients = recipes.reduce((accumulator, recipe) => {
            return accumulator.concat(recipe.ingredients);
        }, []);

        // store ingredients in groceryList object after adding duplicated ingredients.
        const groceryList = {};
        ingredients.forEach((ingredient) => {

            let selectedSystem = unitSystem;
            // convert amount in fractions into float numbers as well as strings into numbers.
            const { name, amount, unit, type, } = ingredient;
            const ingredientAmount = numericQuantity(amount);

            // if duplicate ingredients, add their amounts with same units and then do unit conversion
            // else add both ingredients amount and units as array or list.
            if (name in groceryList) {

                // duplicate ingredient found
                let duplicates = [groceryList[name], { name, amount: ingredientAmount, unit, type }];
                let getUnitSystem = type === 'dry' ? getUnitSystemForDry : getUnitSystemForWet;
                let addIngredients = type === 'dry' ? addDryIngredients : addWetIngredients;

                if (typeof duplicates[0].amount === 'number') {
                    // if the ingredient amount in the grocery List is a number 
                    if (duplicates[0].unit === duplicates[1].unit) {
                        // if both items have same unit, add their amounts

                        let addedAmount = duplicates[0].amount + duplicates[1].amount;
                        if (getUnitSystem(unit) === 'unknown') {
                            // invalid unit e.g cloves or can or any non-metric or non-customary unit 
                            // Simply add their amounts
                            groceryList[name].amount = addedAmount;
                        } else {
                            // units are valid
                            // Add their amounts
                            // After adding amounts, pass through add ingredients function to update amount to appropriate unit.
                            let result = addIngredients([{ name, amount: addedAmount, unit, type }], selectedSystem);
                            groceryList[name].amount = result.amount;
                            groceryList[name].unit = result.unit;
                        }
                    } else {
                        // units are different
                        // if both units are valid
                        if (getUnitSystem(duplicates[0].unit) !== 'unknown' && getUnitSystem(duplicates[1].unit) !== 'unknown') {
                            let result = addIngredients(duplicates, selectedSystem);
                            groceryList[name].amount = result.amount;
                            groceryList[name].unit = result.unit;

                        } else {
                            // if the units are invalid
                            // units are different and not valid units so can't be added, then store them as array.
                            groceryList[name].amount = [duplicates[0].amount, duplicates[1].amount];
                            groceryList[name].unit = [duplicates[0].unit, duplicates[1].unit];

                        }

                    }

                } else if (Array.isArray(duplicates[0].unit)) {
                    // if amount or unit of the duplicate item in the groceryList object is an array
                    // find the unit of the to be added ingredient inside the units array of the duplicate item in the groceryList object.
                    let index = duplicates[0].unit.indexOf(duplicates[1].unit);
                    // if unit found in groceryList i.e same units, simply add amounts
                    if (index !== -1) {
                        let addedAmount = duplicates[0].amount[index] + duplicates[1].amount;
                        let unit = duplicates[1].unit; // or duplicates[0].unit[index]
                        if (getUnitSystem(unit) === 'unknown') {
                            // invalid unit
                            groceryList[name].amount[index] = addedAmount;
                            groceryList[name].unit[index] = unit;
                        } else {
                            // valid unit
                            // After adding amounts, pass item through add ingredients function to convert into appropriate unit.
                            let addedValue = addIngredients([{ amount: addedAmount, unit: duplicates[1].unit }], selectedSystem)
                            groceryList[name].amount[index] = addedValue.amount;
                            groceryList[name].unit[index] = addedValue.unit;
                        }

                    } else {
                        // if unit not found in the duplicate's units array of groceryList object
                        // first push the amount and unit of to be added item into the groceryList item with same name
                        // Then run addIngredients function to add amounts with different units.
                        let addedIngredientsAmounts = [...duplicates[0].amount, duplicates[1].amount];
                        let addedIngredientsUnits = [...duplicates[0].unit, duplicates[1].unit];
                        /*
                        Our add ingredients function take input as array of items as below
                        [
                            { amount: 12, unit: 'tsp', type: 'dry' },
                            { amount: 2, unit: 'tbsp', type: 'dry' },
                            { amount: 1, unit: 'cup', type: 'dry' }
                        ];
                        We will first convert our item data of amounts and unit into that format
                        Then we will separate out valid units from invalid ones.
                        */
                        const validUnitItems = [];
                        const invalidUnitItems = [];
                        addedIngredientsAmounts.forEach((amount, i) => {
                            let item = { amount: amount, unit: addedIngredientsUnits[i], type: type };
                            // check for valid unit system to separate out items with valid and invalid units
                            // Only items with valid units will be processes using add ingredients function to prevent bugs.

                            let getUnitSystem = type === 'dry' ? getUnitSystemForDry : getUnitSystemForWet;
                            if (getUnitSystem(item.unit) !== 'unknown') {
                                // unit is valid 
                                validUnitItems.push(item);
                            } else {
                                // unit is invalid
                                invalidUnitItems.push(item);
                            }

                        });
                        // store both valid and invalid unit items in updatedItem array after processing through add ingredients function
                        const updatedItem = [];
                        if (validUnitItems.length) {
                            let addedItems = addIngredients(validUnitItems, selectedSystem);
                            updatedItem.push(addedItems);
                        }
                        if (invalidUnitItems.length) {
                            // Add amounts with the same units
                            let storage = {};
                            invalidUnitItems.forEach(item => {
                                if (item.unit in storage) {
                                    storage[item.unit].amount += item.amount;
                                } else {
                                    storage[item.unit] = { amount: item.amount, unit: item.unit };
                                }
                            });
                            for (let key in storage) {
                                updatedItem.push({ amount: storage[key].amount, unit: key })
                            }
                        }
                        // Now store the amount and units of updated item array into their respective variables
                        // and update the  amount and unit of duplicate item in the groceryList to the values of those variables.
                        let amounts = [];
                        let units = [];
                        updatedItem.forEach(item => {
                            amounts.push(item.amount);
                            units.push(item.unit);
                        });
                        groceryList[name].amount = amounts;
                        groceryList[name].unit = units;
                    }
                }
            } else {
                groceryList[name] = {
                    name: name,
                    amount: ingredientAmount,
                    unit: unit,
                    type: type

                }
            }

        })

        setGroceries(groceryList);
        setComponent('grocery list');

    };
    const handleAddRecipe = (e, isFavorite, errors) => {
        e.preventDefault();
        if (errors.name || errors.itemName || errors.ItemAmount) {
            alert("Error Saving Recipe!")
            return;
        }
        let form = e.target;
        const recipeId = uuidv4();
        let ingredients;
        if (form.ingredientName[0] === undefined) {
            ingredients = [
                {
                    name: ((form.ingredientName.value).trim()).toLowerCase(),
                    unit: (form.ingredientUnit.value).split(" ")[0].trim(),
                    amount: (form.ingredientAmount.value) ? form.ingredientAmount.value.trim() : '0',
                    type: (form.ingredientUnit.value).split(" ")[1].trim(),
                }
            ]

        } else {
            ingredients = [...form.ingredientName].map((item, i) => (
                {
                    name: ((item.value).trim()).toLowerCase(),
                    unit: ([...form.ingredientUnit][i].value.split(" ")[0]).trim(),
                    amount: ([...form.ingredientAmount][i].value) ? [...form.ingredientAmount][i].value.trim() : '0',
                    type: ([...form.ingredientUnit][i].value.split(" ")[1]).trim(),

                }
            ));
        }
        const recipe = {
            id: recipeId,
            name: (form.name.value).trim(),
            method: (form.method.value).trim(),
            tags: (form.tags.value).split(","),
            ingredients: ingredients,
            favorite: isFavorite
        }
        if (recipe.favorite) {
            setFavorites([...favorites, recipe]);
        }
        setRecipes([...recipes, recipe]);
        // add new recipe to the local storage
        addToStorage(recipe);

    }
    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.elements['search'].value;
        const filteredList = data.filter(recipe => {
            let nameString = '';
            nameString += recipe.name.toLowerCase().trim() + ' ';
            // Tags are arrays
            recipe.tags.forEach(tag => {
                nameString += tag.toLowerCase().trim() + ' '
            })
            return nameString.match(searchTerm.toLowerCase().trim());
        });
        setSearchedRecipes(filteredList);
    }
    return (
        <React.Fragment>
            <ul className={styles.card}>
                {currentComponent === 'final list' ? <FinalList categories={categories} />
                    : currentComponent === 'grocery list' ? (
                        <React.Fragment>
                            <CategoriesDropdown selectedCategory={selectedCategory} categories={categories} handleCategorySelect={handleCategorySelect} />
                            <br />

                            <GroceryList categorize={handleCategorization} groceries={groceries} />
                            <Button variant="success" onClick={handleFinalList}>Done</Button>

                        </React.Fragment>)
                        : currentComponent === 'dropdown' ?
                            (<React.Fragment>
                                <div className="d-flex justify-content-between align-items-center my-4">
                                    <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                                    <SearchComponent handleSearch={handleSearch} />
                                </div>
                                <div className="d-flex justify-content-center align-items-center ">
                                    <RecipesDropdown handleSelectMenu={handleSelectMenu} />
                                    <RecipeForm addRecipe={handleAddRecipe} unitSystem={unitSystem} />
                                </div>
                                <ul>
                                    {searchedRecipes.map(recipe => (
                                        <RenderListItem key={recipe.id} item={recipe} isFavorite={recipe.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} component={currentComponent} />
                                    ))}
                                </ul>
                            </React.Fragment>)
                            : currentComponent === 'recipes' ?
                                <React.Fragment>
                                    <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                                    {recipes.map(item =>
                                        <RenderListItem key={item.id} item={item} isFavorite={item.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} component={currentComponent} />
                                    )}
                                    <Button variant="success" onClick={createIngredientsList}>Generate List</Button>

                                </React.Fragment> : null
                }
            </ul>
        </React.Fragment>
    )
};
export default DisplayList;