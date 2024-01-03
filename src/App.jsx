
// uncomment the line below temporarily to populate local storage with data from data.js
// import data from './data';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { numericQuantity } from 'numeric-quantity';
import { getUnitSystemForWet } from './utilities/addWetIngredients';
import { getUnitSystemForDry } from './utilities/addDryIngredients';
import { addDryIngredients } from './utilities/addDryIngredients';
import { addWetIngredients } from './utilities/addWetIngredients';
import { convertCustomaryToMetric } from './utilities/convertUnitSystem';
import { convertMetricToCustomary } from './utilities/convertUnitSystem';
import { findUnitSystem } from './utilities/convertUnitSystem';
import UnitSystemToggle from './components/toggleSwitch';
import FinalList from './components/renderFinalList';
import RecipeForm from './components/addRecipeForm';
import { v4 as uuidv4 } from 'uuid';
import RenderRecipes from './components/renderRecipes';
import Navbar from './components/Navbar';
import logo from './assets/recipedia-logo.png';


const App = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const [recipes, setRecipes] = useState(data ? data : []);
  const [favorites, setFavorites] = useState([]);
  const [unitSystem, setUnitSystem] = useState('customary');
  const [categories, setCategories] = useState({ 'Fresh Produce': [], 'Dairy and Eggs': [], 'Frozen Food': [], 'Oil and Condiments': [], 'Meat and Seafood': [], 'Bakery': [], 'Breakfast': [], 'Pasta Flour and Rice': [], 'Soups and Cans': [], 'Beverages': [], 'Snacks': [], 'Miscellaneous': [] });
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  useEffect(() => {
    if (data) {
      convertUnitSystemOfRecipes(unitSystem, data);
      setFavorites(data.filter(item => item.favorite));
    }
  }, [unitSystem]);
  
   /********* Local Storage functions **********/
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
  /************ Event handlers ***********/

  const handleDeleteRecipes = (id) => {
    let filteredSearchedRecipes = searchedRecipes.filter(recipe => recipe.id !== id);
    setSearchedRecipes(filteredSearchedRecipes);
    let filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(filteredRecipes);
  };
 
  
  const convertUnitSystemOfRecipes = (selectedSystem, dataArray) => {
    setUnitSystem(selectedSystem);
    let convertUnitSystem = selectedSystem === 'customary' ? convertMetricToCustomary : convertCustomaryToMetric;
    let dataInOneUnitSystem = dataArray.map(data => {
      if (findUnitSystem(data) !== selectedSystem) {
        data.ingredients = convertUnitSystem(data.ingredients);
      }
      return data;
    })
    setRecipes(dataInOneUnitSystem);
  };

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
    if (searchedRecipes.length !== 0) {
      convertUnitSystemOfRecipes(selectedSystem, searchedRecipes);
    } else {
      convertUnitSystemOfRecipes(selectedSystem, recipes);
    }
  }
  const handleSelectMenu = (eventKey) => {
    if (eventKey === 'favorites') {
      setSearchedRecipes([...favorites]);
    } else {
      let count = eventKey;
      const indices = new Set();
      while (indices.size < count && indices.size < recipes.length) {
        let randomIndex = Math.floor(Math.random() * recipes.length);
        indices.add(randomIndex);
      }
      const selectedRecipes = [...indices].map(index => recipes[index]);
      setSearchedRecipes(selectedRecipes);
    }
  }
  const createIngredientsList = (recipes) => {
    // extract ingredients from recipes as ingredient's array
    const ingredients = recipes.reduce((accumulator, recipe) => {
      return accumulator.concat(recipe.ingredients);
    }, []);

    // store ingredients in groceryList object after adding duplicated ingredients.
    const groceryList = {};
    ingredients.forEach((ingredient) => {

      let selectedSystem = unitSystem;
      // convert amount in fractions into float numbers as well as strings into numbers.
      const { name, amount, unit, type, category } = ingredient;
      const ingredientAmount = numericQuantity(amount);

      // if duplicate ingredients, add their amounts with same units and then do unit conversion
      // else add both ingredients amount and units as array or list.
      if (name in groceryList) {

        // duplicate ingredient found
        let duplicates = [groceryList[name], { name, amount: ingredientAmount, unit, type, category }];
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
              let result = addIngredients([{ name, amount: addedAmount, unit, type, category }], selectedSystem);
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
              let item = { amount: amount, unit: addedIngredientsUnits[i], type: type, category: category };
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
          type: type,
          category: category

        }
      }

    })
    let updatedCategories = { ...categories };
    for (let itemName in groceryList) {
      let item = groceryList[itemName]
      if (item.category in updatedCategories) {
        updatedCategories[item.category].push(item);
      } else {
        updatedCategories[item.category] = [item];
      }
    }
    setCategories(updatedCategories);

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
          category: form.ingredientCategory.value
        }
      ]

    } else {
      ingredients = [...form.ingredientName].map((item, i) => (
        {
          name: ((item.value).trim()).toLowerCase(),
          unit: ([...form.ingredientUnit][i].value.split(" ")[0]).trim(),
          amount: ([...form.ingredientAmount][i].value) ? [...form.ingredientAmount][i].value.trim() : '0',
          type: ([...form.ingredientUnit][i].value.split(" ")[1]).trim(),
          category: [...form.ingredientCategory][i].value

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
  const handleAddItem = (e) => {
    e.preventDefault();
    const category = e.target.ingredientCategory.value;
    const item = {
      name: e.target.ingredientName.value,
      amount: parseFloat(e.target.ingredientAmount.value),
      unit: e.target.ingredientUnit.value ? e.target.ingredientUnit.value : "none",
      category: category
    }
    e.target.ingredientCategory.value = "";
    e.target.ingredientName.value = "";
    e.target.ingredientAmount.value = "";
    e.target.ingredientUnit.value = "";
    const updatedCategories = { ...categories };

    let index = Object.keys(updatedCategories).indexOf(category);
    if (index !== -1) {
      updatedCategories[category].push(item);
    } else {
      updatedCategories[category] = [item];
    }
    setCategories(updatedCategories);
  }
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements['search'].value;
    const filteredList = recipes.filter(recipe => {
      let nameString = '';
      nameString += recipe.name.toLowerCase().trim() + ' ';
      // Tags are arrays
      recipe.tags.forEach(tag => {
        nameString += tag.toLowerCase().trim() + ' '
      })
      return nameString.match(searchTerm.toLowerCase().trim());
    });
    e.target.elements['search'].value = "";
    setSearchedRecipes([...searchedRecipes, ...filteredList]);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <React.Fragment>
              <Navbar
                unitSystem={unitSystem}
                toggleUnitSystem={handleUnitSystemToggle}
                handleSearch={handleSearch}
                handleSelectMenu={handleSelectMenu}
                categories={categories}
                handleAddToFavorites={handleAddToFavorites} 
                handleRemoveFromFavorites={handleRemoveFromFavorites}
              />
              <div className="card background">
                <img className="home-img m-auto" src={logo}></img>
            </div>
            </React.Fragment>}>
          </Route>
          <Route
            path="/recipes"
            element={
              (<div className="card background">
                  <center className={"my-3"}> <h1><span className="heading1">Reci</span><span className="heading2" >pe</span><span className="heading3">dia</span></h1></center>
                <div className="page">
                  <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                  <RenderRecipes
                    recipes={searchedRecipes}
                    createIngredientsList={createIngredientsList}
                    handleDeleteRecipes={handleDeleteRecipes}
                    handleAddToFavorites={handleAddToFavorites}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                    unitSystem={unitSystem}
                    toggleUnitSystem={handleUnitSystemToggle}
                  />
                </div>
              </div>)}
          ></Route>
          <Route
            path="/ingredients-list"
            element={
              (<React.Fragment>
                <div className="background">
                <center><h1 className="py-4 text-light"><span className="heading1">Reci</span><span className="heading2">pe</span><span className="heading3">dia</span></h1></center>
                <div className="final-list">
                  <FinalList
                    categories={categories}
                    addItem={handleAddItem}
                  />
                </div>
                </div>
              </React.Fragment>)
            }
          ></Route>

          <Route
            path="/search"
            element={
              <div className="card background">
                  <center><h1 className="py-4"><span className="heading1">Reci</span><span className="heading2">pe</span><span className="heading3">dia</span></h1></center>
                <div className="page">
                  <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                  <br />
                  <RenderRecipes
                    recipes={searchedRecipes}
                    createIngredientsList={createIngredientsList}
                    handleDeleteRecipes={handleDeleteRecipes}
                    handleAddToFavorites={handleAddToFavorites}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                </div>
              </div>}
          ></Route>
          <Route path="/add-recipe" element={
          <div className="d-flex justify-content-center">
          <RecipeForm
            unitSystem={unitSystem}
            categories={categories}
            addRecipe={handleAddRecipe}
          />
          </div>
          }>
            
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
