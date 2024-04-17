import {  useParams } from 'react-router-dom';
import '../App.css';
import FormComponent from './formComponent';

const RecipeForm = ({ unitSystem, toggleUnitSystem, handleSubmitForm, categories }) => {
    const { id } = useParams();
    return (
        <FormComponent 
            unitSystem={unitSystem} 
            toggleUnitSystem={toggleUnitSystem}
            categories={categories}  
            handleSubmitForm={handleSubmitForm}
            param={id}
        />
    )
}

export default RecipeForm;
