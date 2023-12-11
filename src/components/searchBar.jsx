import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { FaSearch } from "react-icons/fa";
const SearchComponent = ({handleSearch}) => {
  return (
    <Form className="d-flex"  id="search-recipes" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              name="search"
            />
            <Button variant="success" type="submit" >
                <FaSearch style={{fill: "white"}} size={21}/>
            </Button>
    </Form>
  )
};
export default SearchComponent;