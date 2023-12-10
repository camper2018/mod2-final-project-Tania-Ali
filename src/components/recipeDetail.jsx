import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaBookOpen } from "react-icons/fa";
const RecipeDetail = ({recipe, addToFavorites, removeFromFavorites, component})=>  {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <FaBookOpen  size={30} onClick={handleShow} style={{ marginRight: '15px' }}/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: "darkgreen"}}>{recipe.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontWeight: "500", color: "grey"}}>
            <h6 style={{color: "tomato"}}>Ingredients</h6>
            <ol>
                {recipe.ingredients.map((item, i) => (
                    <li key={i}>
                        <div className="d-flex justify-content-between">
                        <span>{item.name}</span>
                        <span>{item.amount}&nbsp;&nbsp; {item.unit === 'none'? item.name: item.unit}</span>
                        </div>
                    </li>
                ))
                }
            </ol>
            <h6 style={{color: "tomato"}}>Method</h6>
            {recipe.method?.split("\n").map((sentence, i) => 
               <p key={i}>{sentence}</p>
            )}
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {recipe.favorite && component === 'search'? 
          (<Button variant="danger" onClick={() => {
            handleClose();
            removeFromFavorites(recipe);
          }}>
            Remove from Favorites
          </Button>)
          : 
          component === 'search' && (<Button variant="success" onClick={() => {
            handleClose();
            addToFavorites(recipe);
          }}>
            Add to Favorites
          </Button>)
        
          }
        
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeDetail;