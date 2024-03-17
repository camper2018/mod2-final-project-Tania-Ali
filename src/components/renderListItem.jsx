import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import RecipeDetail from './recipeDetail';
import styles from './renderListItem.module.css';
import { FaEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';

const RenderListItem = ({ item, isFavorite, deleteItem, addToFavorites, removeFromFavorites, handleEdit }) => (
    <div className={styles.container}>
        <li className={styles.li}>
            {item.name}
        </li>
        <div className={styles.iconsContainer}> 
            <RecipeDetail recipe={item} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} />
            {/* if isFavorite is true or truthy and handleEdit is undefined (ie. the component displays list item on render recipes page) */}
            {isFavorite && !handleEdit? 
                <Button variant="transparent" className={"m-0 p-0 me-3  " + styles.starIcon}>
                  <FaStar size={28} fill="orange" onClick={() => removeFromFavorites(item)} />
                </Button> 
                // if isFavorite is false or falsy and component displays list item on render recipes page
                : !handleEdit?
                <Button variant="transparent" className={"m-0 p-0 me-3  " + styles.starIcon}>
                    <CiStar size={30} fill="orange" onClick={() => addToFavorites(item)} />
                </Button> :
                // if component displays list item on my recipes page
                <Button variant="transparent" className={"m-0 p-0 me-3 " + styles.starIcon}><FaEdit size={30} onClick={handleEdit} /></Button>
            }
            <Button variant="transparent" className={"m-0 p-0 me-3 " + styles.crossIcon}><ImCross  size={25} onClick={() => deleteItem(item.id)} /></Button>
        </div>
    </div>
);
export default RenderListItem;