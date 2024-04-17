import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchComponent from './searchBar';
import RecipesDropdown from './dropdownForRecipes';
import styles from './Navbar.module.css';
import Button from 'react-bootstrap/Button';
import UserSettings from './userSetting';
import logo from '../assets/profile-picture-icon.jpg';
import authServices from '../utilities/authServices';
const Navbar = ({ handleSearch, handleSelectMenu }) => {
    const navigate = useNavigate();
    const [userSettings, setUserSettings] = useState({
        username: null,
        avatar: logo
    });

    const handleLogout = () => {
        authServices.logOut();
        setUserSettings({
            avatar: logo,
            username: null
        })
    }
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"))?.email;
        const storedAvatar = localStorage.getItem("profile-picture") || logo;
        setUserSettings({ username: storedUser, avatar: storedAvatar })
    }, []);
    return (
        <div className="container-fluid">
            <div className={"row  " + styles.container} >
                <div className="col-5 col-sm-2 col-md-3">
                    < UserSettings userSettings={userSettings} handleChange={setUserSettings} />
                </div>

                <h1 className="d-none d-md-block offset-md-2 col-md-2"><span className="heading1">Reci</span><span className="heading2" >pe</span><span className="heading3">dia</span></h1>

                <div className="col-7 col-sm-7 offset-sm-3 col-md-3 offset-md-2">
                    <div>
                        {
                            userSettings.username ?
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