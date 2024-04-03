import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchComponent from './searchBar';
import RecipesDropdown from './dropdownForRecipes';
import styles from './Navbar.module.css';
import Button from 'react-bootstrap/Button';
import logo from '../assets/recipedia-icon.png';

const Navbar = ({ handleSearch, handleSelectMenu}) => {
    const navigate = useNavigate();
    const [file, setFile] = useState(logo);
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const [email, setEmail] = useState(user);
    const handleLogout = ()=> {
        localStorage.removeItem("user");
        localStorage.removeItem("recipediajwt");
        setEmail(null);
    }
    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <div className="container-fluid">
            <div className={"row  " + styles.container} >
                <div className="col-5 col-sm-2 col-md-3">
                    <div className={styles.logo}>
                        <div>
                            <button style={{ padding: 0, position: 'relative', border: "none", backgroundColor: "black", marginTop: 0 }} type="button">
                                <input type="file" onChange={handleChange} style={{ position: "absolute", opacity: 0, height: "100px", width: '100px' }} />
                                <img src={file} alt="profile picture" width={90} />
                            </button>
                            <h6 className="text-white fw-bold me-4">Upload Image</h6>
                        </div>
                    </div>
                </div>

                <h1 className="d-none d-md-block offset-md-2 col-md-2"><span className="heading1">Reci</span><span className="heading2" >pe</span><span className="heading3">dia</span></h1>

                <div className="col-7 col-sm-7 offset-sm-3 col-md-3 offset-md-2">
                    <div>
                        {
                            email ?
                                <Link to="/" className={styles.login} onClick={handleLogout}>Logout</Link> :
                                <Link to="/login" className={styles.login}>Login</Link>
                        }
                    </div>
                    <div className={"d-flex flex-column align-items-stretch justify-contents-between " + `${styles.btnContainer}`} >
                        <RecipesDropdown handleSelectMenu={handleSelectMenu} />
                        <Button variant="danger" onClick={() => { navigate('/my-recipes') }}>
                            My Recipes
                        </Button>
                    </div>
                </div>
                <div className={"col-xs-6 offset-xs-6 offset-sm-6 col-sm-6 col-md-6 offset-md-3  " + styles.searchContainer}>
                    <SearchComponent handleSearch={handleSearch} />
                </div>
            </div>
        </div>)
}
export default Navbar;