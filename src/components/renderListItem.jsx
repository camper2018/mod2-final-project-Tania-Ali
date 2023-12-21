import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import RecipeDetail from './recipeDetail';
import styles from './renderListItem.module.css';

const RenderListItem = ({ item, isFavorite, deleteItem, addToFavorites, removeFromFavorites}) => (
    <div className={styles.container}>
        <li className={styles.li}>
            {item.name}
        </li>
        <div className={styles.iconsContainer}>
            <RecipeDetail recipe={item} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites}/>
            {isFavorite ? <FaStar size={28} className={styles.starIcon} onClick={() => removeFromFavorites(item)} /> :
                <CiStar size={30} className={styles.starIcon} onClick={() => addToFavorites(item)} />
            }
            <ImCross size={25} onClick={() => deleteItem(item.id)} />
        </div>
    </div>
);
export default RenderListItem;