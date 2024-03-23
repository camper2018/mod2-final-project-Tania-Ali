import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { IoIosArrowBack } from "react-icons/io";
import Modal from 'react-bootstrap/Modal';
import Styles from './renderListItem.module.css';
import { FaTrash } from "react-icons/fa";
import { FaEnvelopeOpenText } from "react-icons/fa";
import localStore from '../utilities/localStorage';
const RenderRecipes = ({ recipes, createIngredientsList, handleDeleteRecipes, handleAddToFavorites, handleRemoveFromFavorites, handleSavedLists , isFavorite}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const lists = localStore.getSavedListsFromStore();
    const [savedLists, setSavedLists] = useState(lists);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDeleteSavedList = (e)  => {
      const title = e.currentTarget.getAttribute("data-attr");
      const filteredLists = localStore.deleteListFromStore(title);
      setSavedLists(filteredLists);
    };
    const handleSelectSavedList = (e)=> {
        const value = e.currentTarget.getAttribute("data-attr");
        const updatedCategories =  savedLists.filter(list => list.title === value.split(":")[0]);
        handleSavedLists({...(updatedCategories[0]?.categories)});
        navigate("/ingredients-list");
        
    }
    
    return (
        <React.Fragment>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className="bg-warning">
                    <Modal.Title className="mx-auto mt-4 me-0 fw-bold">Saved Lists</Modal.Title>
                </Modal.Header>
                <Modal.Body className="me-4">
                    <ul>
                        {savedLists.map((list , i)=> {
                            return (
                            <div key={list.title} id={list.title} className={Styles.container +  " px-3"}>
                                <li className={Styles.li} >{list.title}</li>
                                <div>
                                    <Button className="btn-sm me-4" variant="link" data-attr={list.title + ":" + i} onClick={handleSelectSavedList}>
                                      <FaEnvelopeOpenText fill="orange" size={24}/>
                                    </Button>
                                    <Button variant="link" data-attr={list.title} onClick={handleDeleteSavedList}>
                                       <FaTrash size={24} fill="#5C4033"/>
                                    </Button>
                                </div>
                               
                            </div>
                        )})}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button className="m-auto ms-0" variant="success" onClick={() => navigate('/')}><IoIosArrowBack size={18} /> Add More</Button>
            <div className="h-75 overflow-scroll">
                {recipes.map((item, i) =>
                    <RenderListItem  key={i} item={item} isFavorite={isFavorite(item.id)} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} />
                )}
            </div>
            <div className="mt-2 d-flex justify-content-evenly w-100 mx-auto">
                <Button variant="success" onClick={() => {
                    navigate('/ingredients-list')
                    createIngredientsList(recipes);
                }}>Generate List</Button>
                <Button variant="warning" onClick={() => {
                    handleShow();
                }}>Get Saved List</Button>
            </div>
        </React.Fragment>
    )
};

export default RenderRecipes;