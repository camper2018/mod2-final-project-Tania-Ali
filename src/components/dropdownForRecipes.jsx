import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const RecipesDropdown = ({ handleSelectMenu }) => {
  return (
    <Dropdown>
      <DropdownButton className="mx-2" id="dropdown-basic-button" title="Select Recipes For" variant="success" onSelect={handleSelectMenu}>
        <Dropdown.Item eventKey="0">none</Dropdown.Item>
        <Dropdown.Item eventKey="1">1 Day</Dropdown.Item>
        <Dropdown.Item eventKey="2">2 Days</Dropdown.Item>
        <Dropdown.Item eventKey="3">3 Days</Dropdown.Item>
        <Dropdown.Item eventKey="4">4 Days</Dropdown.Item>
        <Dropdown.Item eventKey="5">5 Days</Dropdown.Item>
        <Dropdown.Item eventKey="6">6 Days</Dropdown.Item>
        <Dropdown.Item eventKey="7">1 Week</Dropdown.Item>
        <Dropdown.Item eventKey="14">2 Weeks</Dropdown.Item>
        <Dropdown.Item eventKey="21">3 Weeks</Dropdown.Item>
        <Dropdown.Item eventKey="30">1 Month</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="favorites">Favorites</Dropdown.Item>
      </DropdownButton>
    </Dropdown>
  );
}

export default RecipesDropdown;





