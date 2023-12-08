import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { dryConversionFactors } from '../utilities/addDryIngredients';
import { wetConversionFactors } from '../utilities/addWetIngredients';
import { metricDryConversionFactors } from '../utilities/addDryIngredients';
import { metricWetConversionFactors } from '../utilities/addWetIngredients';


const RecipeForm = ({ unitSystem, addRecipe }) => {
    const [show, setShow] = useState(false);
    const [isFavorite, setFavorite] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleAddToFavorite = () => {
        setFavorite(true);
    };
    const handleRemoveFromFavorites = () => {
        setFavorite(false);
    }
    let customaryHTML = [];
    let customaryHTMLDry = Object.keys(dryConversionFactors).map(factor => (<option value={factor + ' dry'}>{factor}&nbsp; *dry</option>));
    let customaryHTMLWet = Object.keys(wetConversionFactors).map(factor => (<option value={factor + ' wet'}>{factor}&nbsp; *liquid</option>));
    // customaryHTML = customaryHTMLDry.join("") + customaryHTMLWet.join("");
    customaryHTML.push(customaryHTMLDry);
    customaryHTML.push(customaryHTMLWet);
    let metricHTML = [];
    const metricHTMLDry = Object.keys(metricDryConversionFactors).map(factor => (<option value={factor + ' dry'}>{factor}&nbsp; *dry</option>));
    const metricHTMLWet = Object.keys(metricWetConversionFactors).map(factor => (<option value={factor + ' wet'}>{factor}&nbsp; *liquid</option>));
    metricHTML.push(metricHTMLDry, metricHTMLWet);
    let optionsHTML = unitSystem === 'customary' ? customaryHTML : metricHTML;
    const [htmlForAddItem, setHTML] = useState([]);
    // const htmlForAddItem = [];
    const handleAddFormEl = () => {
        // console.log('clicked');
        let html = (<div className='d-flex mt-3'>
            <Form.Control
                type="text"
                placeholder="Name"
                autoFocus

            />
            <Form.Control
                type="text"
                placeholder="Amount"
                autoFocus
                className='mx-1'
            />

            <Form.Select aria-label="select unit for ingredient">
                <option>Select Unit</option>
                {optionsHTML}
            </Form.Select>
        </div>);
        setHTML([...htmlForAddItem, html]);
    }
    return (
        <React.Fragment>
            <Button variant="danger" onClick={handleShow}>
                Add Recipe&nbsp;
                <FaPlus />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <div>
                        {isFavorite ? <FaStar size={30} fill={"orange"} onClick={handleRemoveFromFavorites} /> :
                            <CiStar size={34} onClick={handleAddToFavorite} />
                        }
                    </div>
                    <Modal.Title style={{ margin: "0 auto" }}>Create Your Recipe Here</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Recipe Name"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="recipeForm.ControlTextarea1"
                        >
                            <Form.Label>Method</Form.Label>
                            <Form.Control as="textarea" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput2">
                            <Form.Label>Tag/ Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="vegan, gluten-free, dairy-free, seafood,egg-free"
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput3">
                            <Form.Label>Ingredients</Form.Label>
                            <Button className='float-end' variant="secondary" onClick={handleAddFormEl}>ADD</Button>

                            <div className='d-flex mt-3'>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    autoFocus

                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Amount"
                                    autoFocus
                                    className='mx-1'
                                />

                                <Form.Select aria-label="select unit for ingredient">
                                    <option>Select Unit</option>
                                    {optionsHTML}
                                </Form.Select>

                            </div>
                            {htmlForAddItem}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>);
}

export default RecipeForm;