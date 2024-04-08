import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
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
import MyRecipes from './components/renderMyRecipes';
import EditRecipeForm from './components/editRecipeForm';
import localStore from './utilities/localStorage';
import Loading from "./components/loading";
import ErrorComponent from './components/displayError';
import Register from './components/register';
import Login from './components/login';
import AddFormComponent from './components/addFormComponent';
import EditFormComponent from './components/editFormComponent';
// import EditRecipe from './components/editRecipes';
const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [unitSystem, setUnitSystem] = useState('customary');
  const [categories, setCategories] = useState({ 'Fresh Produce': [], 'Dairy and Eggs': [], 'Frozen Food': [], 'Oil and Condiments': [], 'Meat and Seafood': [], 'Bakery': [], 'Breakfast': [], 'Pasta Flour and Rice': [], 'Soups and Cans': [], 'Beverages': [], 'Snacks': [], 'Miscellaneous': [] });
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const jwt = localStorage.getItem('recipediajwt');
  // const navigate = useNavigate();
  useEffect(() => {
    if (recipes.length) {
      convertUnitSystemOfRecipes(unitSystem, recipes);
    }
    const myFavorites = localStore.getFavoritesFromStore();
    setFavorites(myFavorites);
  }, [unitSystem]);

  /************ Event handlers ***********/

  const handleDeleteRecipes = (id) => {
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(filteredRecipes);
  };

  // gets the selected savedList from local storage and set categories to that list so that it can be displayed by FinalList component.
  const handleSavedLists = (list) => {
    setCategories(list);
  }

  const convertUnitSystemOfRecipes = (selectedSystem, dataArray) => {
    setUnitSystem(selectedSystem);
    if (dataArray.length) {
      let convertUnitSystem = selectedSystem === 'customary' ? convertMetricToCustomary : convertCustomaryToMetric;
      let dataInOneUnitSystem = dataArray.map(data => {
        if (findUnitSystem(data) !== selectedSystem) {
          data.ingredients = convertUnitSystem(data.ingredients);
        }
        return data;
      })
      setRecipes(dataInOneUnitSystem);
    }
  };

  const handleAddToFavorites = (recipe) => {
    setFavorites([...favorites, recipe]);
    localStore.addFavoritesToStore(recipe);
  };
  const handleRemoveFromFavorites = (recipe) => {
    let updatedFavorites = favorites.filter(item => item.id !== recipe.id)
    setFavorites(updatedFavorites);
    localStore.removeFavoritesFromStore(updatedFavorites);

  };

  const handleUnitSystemToggle = (e) => {
    let selectedSystem = e.target.checked ? 'metric' : 'customary';
    convertUnitSystemOfRecipes(selectedSystem, recipes);

  }
  const handleSelectMenu = async (eventKey) => {
    if (eventKey === 'favorites') {
      setRecipes([...favorites]);
    } else {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/recipes/random-recipes/${eventKey}`)
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
          setLoading(false);
        } else {
          throw Error(`${response.status} (${response.statusText})`)
        }
      } catch (error) {
        setLoading(false);
        console.log("Error: ", error.message);
        setError(error.message);
      }
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

  const handleAddRecipe = async (recipe) => {
    const recipeId = uuidv4();
    recipe.favorite = false;
    recipe.id = recipeId;

    // save recipe
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // const response = await fetch(`http://localhost:5000/api/recipes/${user.id}`, {
      const response = await fetch(`http://localhost:5000/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${jwt}`
          
        },
        body: JSON.stringify(recipe)
      })
      if (response.ok) {
        await response.json();
        setRecipes(prevRecipes => [...prevRecipes, recipe]);
        alert(`Your recipe ${recipe.name} was saved successfully`);
      } else {
        throw Error(`${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }
  const handleEditRecipe = async (updatedRecipe, id)=> {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify(updatedRecipe),
      })
      if (response.ok) {
          alert(`Successfully updated ${updatedRecipe.name} recipe.`);
          // navigate('/my-recipes');
      } else {
          throw Error(`${response.statusText}: ${response.status}`);
      }
  } catch (err) {
      console.error(err.message);
      setError({ ...error, updateError: err.message })
      setError(err.message)
  }
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
  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements['search'].value;
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/recipes/search/${searchTerm.trim()}`)
      if (response.ok) {
        const data = await response.json();
        e.target.elements['search'].value = "";
        setSearchedRecipes([...searchedRecipes, ...data]);
        setRecipes([...recipes, ...data]);
        setLoading(false);
      } else {
        throw Error(`${response.status} (${response.statusText})`)
      }
    } catch (error) {
      setLoading(false);
      console.log("Error: ", error.message);
      setError(error.message);
    }
  }
  if (isLoading) {
    return (<div className="page mx-auto">
      < Loading />
    </div>)
  }
  if (error) {
    return  <ErrorComponent error={error} /> 
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
          <Route path="/recipes"
            element={
              (<div className="card background">
                <Link to=".."><center className={"my-3"}> <h1><span className="heading1">Reci</span><span className="heading2" >pe</span><span className="heading3">dia</span></h1></center></Link>
                <div className="page">
                  <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                  <RenderRecipes
                    recipes={recipes}
                    createIngredientsList={createIngredientsList}
                    handleDeleteRecipes={handleDeleteRecipes}
                    handleAddToFavorites={handleAddToFavorites}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                    handleSavedLists={handleSavedLists}
                    isFavorite={localStore.checkFavoritesStore}
                  />
                </div>
              </div>)}
          ></Route>
          <Route path="/ingredients-list"
            element={
              (<React.Fragment>
                <div className="background">
                  <center><h1 className="py-4 text-light"><span className="heading1">Reci</span><span className="heading2">pe</span><span className="heading3">dia</span></h1></center>
                  <div className="final-list">
                    <FinalList
                      categories={categories}
                      setCategories={setCategories}
                      addItem={handleAddItem}
                      handleSavedLists={handleSavedLists}
                    />
                  </div>
                </div>
              </React.Fragment>)
            }
          ></Route>
          <Route path="/search"
            element={
              <div className="card background">
                <Link to='/'><center><h1 className="py-4"><span className="heading1">Reci</span><span className="heading2">pe</span><span className="heading3">dia</span></h1></center></Link>
                <div className="page">
                  <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                  <br />
                  <RenderRecipes
                    recipes={recipes}
                    createIngredientsList={createIngredientsList}
                    handleDeleteRecipes={handleDeleteRecipes}
                    handleAddToFavorites={handleAddToFavorites}
                    handleRemoveFromFavorites={handleRemoveFromFavorites}
                    handleSavedLists={handleSavedLists}
                    isFavorite={localStore.checkFavoritesStore}
                  />
                </div>
              </div>}
          ></Route>
          <Route path="/add-recipe" element={
            // <div>
            //   <RecipeForm
            //     unitSystem={unitSystem}
            //     toggleUnitSystem={handleUnitSystemToggle}
            //     categories={categories}
            //     addRecipe={handleAddRecipe}
            //   />
            // </div>
            <AddFormComponent
              unitSystem={unitSystem}
              toggleUnitSystem={handleUnitSystemToggle}
              categories={categories}
              handleSubmitForm={handleAddRecipe}
            />}
          >
          </Route>
          <Route path="/my-recipes" element={
            <div className="card background">
              <Link to="/"><center><h1 className="py-4 fw-bold"><span className="heading1">My Recipes</span></h1></center></Link>
              <div className="page mb-5">
                <MyRecipes />
              </div>
            </div>
          }>
          </Route>
          <Route path="/edit-recipe/:id" element={
            // <div>
            //   <EditRecipeForm
            //     unitSystem={unitSystem}
            //     toggleUnitSystem={handleUnitSystemToggle}
            //     categories={categories}
            //   />
            // </div>
            <EditFormComponent
              unitSystem={unitSystem}
              toggleUnitSystem={handleUnitSystemToggle}
              categories={categories}
              handleSubmitForm={handleEditRecipe}
            />}>
          </Route>
          <Route path="/register" element={
              <Register/>
          }>
          </Route>
          <Route path="/login" element={
              <Login/>
          }>
            </Route>
          {/* <Route path="/form" element={
          <AddFormComponent
            unitSystem={unitSystem}
            toggleUnitSystem={handleUnitSystemToggle}
            categories={categories}
            handleSubmitForm={handleAddRecipe}
          />}>
          </Route> */}
          {/* <Route path="/editform/:id" element={
            <EditFormComponent
              unitSystem={unitSystem}
              toggleUnitSystem={handleUnitSystemToggle}
              categories={categories}
              handleSubmitForm={handleEditRecipe}
            />}>
          </Route> */}
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
