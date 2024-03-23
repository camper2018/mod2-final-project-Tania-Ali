/********* Local Storage functions **********/
const getFavoritesFromStore = () => {
    const myFavorites = localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : [];
    return myFavorites;
}
const addFavoritesToStore = (recipe) => {
    const myFavorites = getFavoritesFromStore();
    myFavorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(myFavorites));
}
const checkFavoritesStore = (id) => {
    const myFavorites = getFavoritesFromStore();
    const isFavorite = myFavorites.some(recipe => recipe.id === id);
    return isFavorite;
};
const removeFavoritesFromStore = (updatedFavorites) => {
   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}
const getSavedListsFromStore = ()=> {
    const savedLists = localStorage.getItem("myLists")? JSON.parse(localStorage.getItem("myLists")): [];
    return savedLists;
}
const saveListToStore = (list)=> {
    const myLists = getSavedListsFromStore();
    myLists.push(list);
    localStorage.setItem('myLists', JSON.stringify(myLists));
    // return myLists;    
}
const deleteListFromStore = (title) => {
    const savedLists = getSavedListsFromStore();
    const filteredLists = savedLists.filter(list => list.title !== title);
    localStorage.setItem("myLists", JSON.stringify(filteredLists));
    return filteredLists;
};
export default {
    getFavoritesFromStore,
    addFavoritesToStore,
    checkFavoritesStore,
    removeFavoritesFromStore,
    getSavedListsFromStore,
    deleteListFromStore,
    saveListToStore 
}