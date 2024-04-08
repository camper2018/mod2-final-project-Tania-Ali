import { isPlural } from '../utilities/findPlural';
import { numericQuantity } from 'numeric-quantity';
import '../App.css';
import FormComponent from './formComponent';

const AddFormComponent = ({ unitSystem, toggleUnitSystem, categories, handleSubmitForm }) => {

        return (
            <FormComponent 
            unitSystem={unitSystem} 
            toggleUnitSystem={toggleUnitSystem}
            categories={categories}  
            handleSubmitForm={handleSubmitForm}
           
            
            />
        )
    
}
export default AddFormComponent;


