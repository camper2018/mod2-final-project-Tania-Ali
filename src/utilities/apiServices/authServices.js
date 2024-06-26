const baseUrl = import.meta.env.VITE_BASE_URL;

const register = async (email, password, username) => {
    const fetchResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, username })
    });
    const data = await fetchResponse.json();
  
    return data;
}
const logIn = async (email, password) => {
    const fetchResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await fetchResponse.json();
    return data;
  }
  
const logOut = () => {
    try {
        localStorage.clear();
      } catch (error) {
        console.error("Error removing item from local storage:", error);
      }
}
export default {
    register,
    logIn,
    logOut
}