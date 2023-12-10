import { FaTrashCan } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import RecipeDetail from './recipeDetail';
const RenderListItem = ({ item, isFavorite, deleteItem, addToFavorites, removeFromFavorites, component={component} }) => (
    <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px" }}>
        <li style={{ listStyleType: "none" }}>
            {item.name}
        </li>
        <div>
            <RecipeDetail recipe={item} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites}/>
            {isFavorite ? <FaStar size={28} style={{ marginRight: '15px' }} onClick={() => removeFromFavorites(item)} /> :
                <CiStar size={30} style={{ marginRight: '15px' }} onClick={() => addToFavorites(item)} />
            }
            <FaTrashCan size={25} onClick={() => deleteItem(item.id)} />
        </div>
    </div>


);
export default RenderListItem;