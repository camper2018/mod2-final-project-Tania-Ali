import { FaTrashCan } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

const RenderListItem = ({item,isFavorite, deleteItem,addToFavorites, removeFromFavorites })=> (
    <div style={{padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px"}}>
    <li style={{listStyleType: "none"}}>
        {item.name}
    </li>
    <div>
    {isFavorite?  <FaStar size={28} style={{ marginRight: '15px'}} onClick={()=> removeFromFavorites(item)}/>:
     <CiStar size={30} style={{ marginRight: '15px'}} onClick={() => addToFavorites(item)}/>
    } 
    <FaTrashCan size={25} onClick={()=> deleteItem(item.name)}/>
    </div>
    </div>

        
);
export default RenderListItem;