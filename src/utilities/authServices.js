export const register = async (email, password) => {
    const fetchResponse = await fetch('http://localhost:5000/api/auth/register', {
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
    const fetchResponse = await fetch('http://localhost:5000/api/auth/log-in', {
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
    localStorage.removeItem('recipediajwt');
}