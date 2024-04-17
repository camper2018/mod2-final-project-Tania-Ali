const baseUrl = import.meta.env.VITE_BASE_URL;

export const register = async (email, password) => {
    const fetchResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await fetchResponse.json();
  
    return data;
  }
export const logIn = async (email, password) => {
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
  
  export const logOut = () => {
    window.localStorage.clear();
}