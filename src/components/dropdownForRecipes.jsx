import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {useNavigate} from 'react-router-dom';

const RecipesDropdown = ({ handleSelectMenu }) => {
  const navigate = useNavigate();
  return (
    <Dropdown>
      <DropdownButton className="my-2" id="dropdown-basic-button" title="Select Recipes For" variant="success" onSelect={(e)=> {
        handleSelectMenu(e);
        navigate('/recipes')
        }}>
        <Dropdown.Item eventKey="0">none</Dropdown.Item>
        <Dropdown.Item eventKey="1">1 Day</Dropdown.Item>
        <Dropdown.Item eventKey="2">2 Days</Dropdown.Item>
        <Dropdown.Item eventKey="3">3 Days</Dropdown.Item>
        <Dropdown.Item eventKey="4">4 Days</Dropdown.Item>
        <Dropdown.Item eventKey="5">5 Days</Dropdown.Item>
        <Dropdown.Item eventKey="6">6 Days</Dropdown.Item>
        <Dropdown.Item eventKey="7">1 Week</Dropdown.Item>
        {/* <Dropdown.Item eventKey="14">2 Weeks</Dropdown.Item> */}
        {/* <Dropdown.Item eventKey="21">3 Weeks</Dropdown.Item> */}
        {/* <Dropdown.Item eventKey="30">1 Month</Dropdown.Item> */}
        <Dropdown.Divider />
        <Dropdown.Item className="text-primary" eventKey="favorites">Favorites</Dropdown.Item>
      </DropdownButton>
    </Dropdown>
  );
}

export default RecipesDropdown;





