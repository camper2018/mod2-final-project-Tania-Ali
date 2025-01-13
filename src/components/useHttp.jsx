import { useState} from 'react';
const baseUrl = import.meta.env.VITE_BASE_URL;

const useHttp = (endpoint, options={}, callback) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const sendHttpRequest = async (param, body) => {
        try {
            const apiUrl = param ? endpoint + `/${param}` : endpoint; 
            const response = await fetch(`${baseUrl}/${apiUrl}`, {
                ...options,
                body: body? JSON.stringify(body): null
            });
            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.message || `Error: ${response.status} ${response.statusText}`;
                throw new Error(message);
            }
            const data = await response.json();
            callback(data)
        } catch (error) {
            setErrorMessage(error.message);
        }
    }

    return [errorMessage, sendHttpRequest]

};
export default useHttp;