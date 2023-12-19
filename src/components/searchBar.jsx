import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const SearchComponent = ({handleSearch}) => {
    const navigate = useNavigate();
  return (
    <Form className="d-flex"  id="search-recipes" onSubmit={ (e) => { 
          handleSearch(e); 
          navigate('/search')}
        }>
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