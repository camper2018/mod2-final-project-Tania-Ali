import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import { MdFormatListBulletedAdd } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import styles from './searchBar.module.css';
const SearchComponent = ({ handleSearch }) => {
  const navigate = useNavigate();
  const renderTooltip = (props) => (
    <Tooltip className="mt-3" id="placeholder-tooltip" {...props}>
      Search a recipe by matching name or tag.
    </Tooltip>
  );
  return (
    <Form className="d-flex" id="search-recipes" onSubmit={(e) => {
      navigate('/search');
      handleSearch(e);
    }
    }><OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
        <Form.Control
          type="search"
          className={`me-2 ps-5 pe-0 relative fw-medium ${styles.searchInput}`}
          aria-label="Search a recipe"
          name="search"
          placeholder="Search"
        />
      </OverlayTrigger>

      <FaSearch size={28} style={{ backgroundColor: "transparent", color: "grey", border: "none", position: "absolute", margin: "10px", marginLeft: "12px" }} />

      <Button variant="success" type="submit" >
        <MdFormatListBulletedAdd size={30} />
      </Button>
    </Form>
  )
};
export default SearchComponent;