import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const CategoriesDropdown = ({ selectCategory, categories }) => {

    // categories is an object with properties as various food categories and values an array that stores items in respective category when a client selects a category and clicks on that item.
    return (
        <Dropdown>
            <DropdownButton onSelect={selectCategory} id="dropdown-basic-button" title="Select a Category" variant="success">
                {Object.keys(categories).map((category, i) => (
                    <Dropdown.Item key={i} eventKey={category}>{category}</Dropdown.Item>
                )
                )}
            </DropdownButton>
        </Dropdown>
    );
}

export default CategoriesDropdown;
