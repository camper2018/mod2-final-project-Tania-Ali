import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
const SearchComponent = ({ handleSearch }) => {
  const navigate = useNavigate();
  return (
    <Form className="d-flex" id="search-recipes" onSubmit={(e) => {
      navigate('/search');
      handleSearch(e);
    }
    }>
      <Form.Control
        type="search"
        className="me-2 ps-5 relative fw-medium"
        aria-label="Search a recipe"
        name="search"
      />''
      <FaSearch size={28} style={{backgroundColor: "transparent", color: "grey", border: "none", position: "absolute", margin: "10px", marginLeft: "12px"}}/>
      <Button variant="success" type="submit" >
        <MdFormatListBulletedAdd size={30} />
      </Button>
    </Form>
  )
};
export default SearchComponent;