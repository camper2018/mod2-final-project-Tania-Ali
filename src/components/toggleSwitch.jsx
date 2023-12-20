import Form from 'react-bootstrap/Form';
import styles from './toggleSwitch.module.css';
const UnitSystemToggle = ({unitSystem, toggleUnitSystem})=>{
    return (
      <Form className={styles.container}>
        <Form.Check
          className={styles.switch}
          type="switch"
          id="custom-switch"
          label={unitSystem.toUpperCase()}
          onChange={toggleUnitSystem}
        />
      </Form>
    );
  }
  
  export default UnitSystemToggle;