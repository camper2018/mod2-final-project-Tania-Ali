import UnitSystemToggle from './toggleSwitch'
import SearchComponent from './searchBar';
import RenderListItem from './renderListItem';
import RecipesDropdown from './dropdownForRecipes';
import RecipeForm  from './addRecipeForm';


const Home = () => {

    const handleUnitSystemToggle = (e) => {
        let selectedSystem = e.target.checked ? 'metric' : 'customary';
        if (searchedRecipes.length !== 0){
            convertUnitSystemOfRecipes(selectedSystem, searchedRecipes);
        } else {
            convertUnitSystemOfRecipes(selectedSystem, recipes);
        }
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
   return (
    <React.Fragment>
                <div className="d-flex justify-content-between align-items-center my-4">
                      <UnitSystemToggle unitSystem={unitSystem} toggleUnitSystem={handleUnitSystemToggle} />
                      <SearchComponent handleSearch={handleSearch} />
                </div>
                        <div className="d-flex justify-content-center align-items-center ">
                            <RecipesDropdown handleSelectMenu={handleSelectMenu} />
                            <RecipeForm addRecipe={handleAddRecipe} unitSystem={unitSystem} categories={categories} />
                       </div>
                        <br />
                        <ul>
                           {searchedRecipes.map(recipe => (
                                 <RenderListItem key={recipe.id} item={recipe} isFavorite={recipe.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} component={currentComponent} />
                            ))}
                        </ul>
                        {searchedRecipes.length ? <Button variant="success" onClick={()=> createIngredientsList(searchedRecipes)
                         }>Generate List</Button> : null}
                    </React.Fragment>
   )
}
export default Home;