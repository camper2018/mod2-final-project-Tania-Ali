import Form from 'react-bootstrap/Form';
import Styles from './form.module.css';
const UnitSystemToggle = ({unitSystem, toggleUnitSystem})=>{
    return (
      <Form>
        <Form.Check
          className={Styles.switch}
          type="switch"
          id="custom-switch"
          label={unitSystem.toUpperCase()}
          onChange={toggleUnitSystem}
        />
       
      </Form>
    );
  }
  
  export default UnitSystemToggle;