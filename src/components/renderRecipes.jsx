import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { IoIosArrowBack } from "react-icons/io";
import Modal from 'react-bootstrap/Modal';
import Styles from './renderListItem.module.css';
import { FaTrash } from "react-icons/fa";
import { FaEnvelopeOpenText } from "react-icons/fa";
const RenderRecipes = ({ recipes, createIngredientsList, handleDeleteRecipes, handleAddToFavorites, handleRemoveFromFavorites, handleSavedLists }) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const lists = localStorage.getItem("myLists")? JSON.parse(localStorage.getItem("myLists")): null;
    const [savedLists, setSavedLists] = useState(lists || []);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        let data = localStorage.getItem("myList");
        if (data){
           setSavedLists(JSON.parse(data));
        }
    },[savedLists]);
    const handleDeleteSavedList = (e)  => {
      const title = e.target.parentNode.parentNode.parentNode.id;
      const filteredLists = savedLists.filter(list => list.title !== title);
      localStorage.setItem("myLists", JSON.stringify(filteredLists));
      setSavedLists(filteredLists);
      
    };
    const handleSelectSavedList = (e)=> {
        console.log( e.target.id.split(":")[0]);
        const updatedCategories = savedLists.filter(list => list.title === e.target.id.split(":")[0]);
        console.log(updatedCategories[0]?.categories, "categories");
        handleSavedLists({...(updatedCategories[0]?.categories)});
        navigate('/saved-lists');
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
                            console.log(list, "list***");
                            return (
                            <div key={list.title} id={list.title} className={Styles.container +  " px-3"}>
                                <li className={Styles.li} >{list.title}</li>
                                <div>
                                    <FaEnvelopeOpenText  id={list.title + ":" + i} className="me-4" size={24} onClick={handleSelectSavedList}/>
                                    <FaTrash size={24} onClick={handleDeleteSavedList}/>
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
                {recipes.map(item =>
                    <RenderListItem key={item.id} item={item} isFavorite={item.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} />
                )}
            </div>
            <div className="mt-2 d-flex justify-content-evenly w-100 mx-auto">
                <Button variant="success" onClick={() => {
                    createIngredientsList(recipes);
                    navigate('/ingredients-list')
                }}>Generate List</Button>
                <Button variant="warning" onClick={() => {
                    handleShow();
                }}>Saved List</Button>
            </div>
        </React.Fragment>
    )
};

export default RenderRecipes;