const baseUrl = import.meta.env.VITE_BASE_URL;

const useFetch = async (endpoint, options) => {
    const fetchResponse = {
        data: null,
        error: null
    }
   try {
       const response = await fetch(`${baseUrl}/${endpoint}`, options);
        if (response.ok) {
            const data = await response.json();
            fetchResponse.data = data;
            } else {
                throw Error(`${response.status} (${response.statusText})`)
            }
    } catch (error) {
        fetchResponse.error = error;
    }
    return fetchResponse;
}

// fetch recipe / recipes
const getRecipes = (endpoint, jwt) => {
    const options = jwt ? {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    } 
    : 
    { method: 'GET'};
    return  useFetch(endpoint, options);
}
// Add or Update a recipe
const postRecipe = async (endpoint, method, jwt, data) => {
   const options = {
    method: `${method}`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}` 
    },
    body: JSON.stringify(data)
   }
   return useFetch(endpoint, options);

}
// Delete a recipe
const deleteRecipe = async (endpoint, jwt) => {
    const options = {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${jwt}`
        }
    };
    return useFetch(endpoint, options);
}
export default {
    getRecipes,
    postRecipe,
    deleteRecipe
}

