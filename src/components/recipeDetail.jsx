import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaBookOpen } from "react-icons/fa";
import styles from './recipeDetail.module.css';
const RecipeDetail = ({ recipe }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const tags = recipe.tags;
  const colors = ["warning", "success", "info", "danger", "secondary"]
  return (
    <>
      <FaBookOpen size={30} onClick={handleShow} className={styles.bookIcon} />
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className={styles.title}>{recipe.name}<span style={{fontSize: '16px', color: "orange", marginLeft: '10px'}}>Contributor: {recipe.writer}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.body}>
          <div className="d-flex justify-content-end text-white fw-bold">
            {
              tags && tags[0] && tags.map((tag, i) => <div key={i} className={"bg-" + colors[i]+ " mx-2 p-2"}>{tag}</div>)
            }
          </div>
          <h6 className={styles.subTitle}>Ingredients</h6>
          <ol>
            {
            recipe.ingredients.map((item, i) => (
              <li key={i}>
                <div className={styles.list}>
                  <span>{item.name}</span>
                  <span>{Math.round(parseFloat(item.amount))}&nbsp;&nbsp;&nbsp; {item.unit === 'none' ? item.name : item.unit}</span>
                </div>
              </li>
            ))}
          </ol>
          <h6 className={styles.subTitle}>Method</h6>
          {recipe.method?.split('\\n').map((sentence, i) => (<p key={i}>{sentence}</p>))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeDetail;