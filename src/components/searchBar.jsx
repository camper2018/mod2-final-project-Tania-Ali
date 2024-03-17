import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import { MdFormatListBulletedAdd } from "react-icons/md";

const SearchComponent = ({handleSearch}) => {
    const navigate = useNavigate();
  return (
    <Form className="d-flex"  id="search-recipes" onSubmit={ (e) => { 
          handleSearch(e); 
          navigate('/search')}
        }>
            <Form.Control
              type="search"
              placeholder="Search a recipe"
              className="me-2"
              aria-label="Search a recipe"
              name="search"
            />
            <Button variant="success" type="submit" >
                <MdFormatListBulletedAdd size={30}/>
            </Button>
    </Form>
  )
};
export default SearchComponent;