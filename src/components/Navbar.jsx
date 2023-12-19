import { useNavigate } from 'react-router-dom';
import SearchComponent from './searchBar';
import RecipesDropdown from './dropdownForRecipes';
import styles from './Navbar.module.css';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa";
import logo from '../assets/recipedia-icon.png';
const Navbar = ({handleSearch, handleSelectMenu}) => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid">
            <div className={"row  " + styles.container} >
                <div className="col-5 col-sm-2 col-md-3">
                    <div className={styles.logo}>
                        <img src={logo} alt="logo" width={90}/>
                    </div>
                </div>
                
                <h1 className="d-none d-md-block offset-md-2 col-md-2"><span className="heading1">Reci</span><span className="heading2" >pe</span><span className="heading3">dia</span></h1>
                
                <div className="col-7 col-sm-7 offset-sm-3 col-md-3 offset-md-2">
                    <div className={"d-flex flex-column align-items-stretch justify-contents-between " + `${styles.btnContainer}`} >
                        <RecipesDropdown handleSelectMenu={handleSelectMenu} />
                        <Button  variant="danger" onClick={() => {navigate('/add-recipe') }}>
                           Add Recipe&nbsp;
                           <FaPlus />
                        </Button>
                    </div>
                </div>
                <div className={"col-12 offset-md-3 col-md-6  " + styles.searchContainer}>
                    <SearchComponent handleSearch={handleSearch} />
                </div>
            </div>
        </div>)
}
export default Navbar;