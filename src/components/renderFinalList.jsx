import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './renderFinalList.module.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { numericQuantity } from 'numeric-quantity';
import { IoHome } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";

const FinalList = ({ categories, addItem}) => {
    const [showForm, setShowForm] = useState(false);
    const [showAddButton, setShowButton] = useState(true);
    const [errors, setErrors] = useState({});
    // const [isEditing, setIsEditing] = useState(false);
    const [showListForm, setShowListForm] = useState(false);
    // const [showEditForm, setShowEditForm] = useState(false);
    const handleClose = () => setShowListForm(false);
    const handleShow = () => setShowListForm(true);

    const navigate = useNavigate();

    const handleItemName = (e) => {
        let name = e.target.value;
        if (name === '') {
            setErrors({ ...errors, itemName: 'Please enter ingredient name!' });
        } else {
            setErrors({ ...errors, itemName: null })
        }
    }
    const handleItemAmount = (e) => {
        if (isNaN(numericQuantity(e.target.value))) {
            setErrors({ ...errors, itemAmount: 'Please enter a valid numeric amount!' });
        } else {
            setErrors({ ...errors, itemAmount: null });
        }
    }
    const handleItemCategory = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, itemCategory: 'Category is required!' });
        } else {
            setErrors({ ...errors, itemCategory: null });
        }
    }
    const handleSaveList = async (e) => {
        e.preventDefault();
        const myLists = await localStorage.getItem("myLists")? JSON.parse(localStorage.getItem("myLists")) : [];
        const isDuplicate = myLists.some(list => list.title === e.target[0].value);
        if (!isDuplicate) {
            myLists.push({ title: e.target[0].value, categories: categories });
            await localStorage.setItem('myLists', JSON.stringify(myLists));
            setErrors({ ...errors, duplicate: null });
            handleClose();
            location.reload();
        } else {
            setErrors({...errors, duplicate: "Duplicate title! Please enter unique title"});
        }
    }
    const handleEditItem = (item) =>{
      console.log("item: ", item);
    }
    return (
        <React.Fragment>
            <Modal show={showListForm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Save List</Modal.Title>
                </Modal.Header>
                <Form id="lists" onSubmit={handleSaveList}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInputTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter List Title"
                                autoFocus
                                name="title"
                            isInvalid={!!errors.duplicate}
                            />
                            <Form.Control.Feedback type="invalid">{errors.duplicate}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="secondary" id="lists" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Button style={{ display: `${showAddButton ? "inline" : "none"}` }} variant="danger" onClick={() => {
                navigate('/');
                window.location.reload();
            }}><IoHome fill={"white"} size={25} /></Button>
            <center><Button variant="success" className="my-3" onClick={() => setShowForm(true)} style={{ display: `${showAddButton ? "flex" : "none"}` }}>Add Item</Button></center>

            <Form style={{ display: `${showForm ? "block" : "none"}` }} onSubmit={(e) => {
                addItem(e);
                setShowForm(false);
            }}>
                <div className='d-flex mx-3' name="ingredients" >
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        name="ingredientName"
                        isInvalid={!!errors.itemName}
                        onBlur={handleItemName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.itemName}</Form.Control.Feedback>

                    <Form.Control
                        type="text"
                        placeholder="Amount"
                        className='mx-1'
                        name="ingredientAmount"
                        isInvalid={!!errors.itemAmount}
                        onBlur={handleItemAmount}
                    />
                    <Form.Control.Feedback type="invalid">{errors.itemAmount}</Form.Control.Feedback>
                    <Form.Control
                        type="text"
                        placeholder="Unit"
                        className='mx-1'
                        name="ingredientUnit"
                    />
                    <Form.Control
                        type="text"
                        placeholder="Category"
                        className='mx-1'
                        name="ingredientCategory"
                        isInvalid={!!errors.itemCategory}
                        onBlur={handleItemCategory}
                    />
                    <Form.Control.Feedback type="invalid">{errors.itemCategory}</Form.Control.Feedback>
                    <Button variant="secondary" type="submit">Add</Button>
                </div>
            </Form>

            <br />
            <div style={showAddButton ? { height: "80vh", overflowY: "scroll" } : { overflowY: "visible" }}>
                {
                    Object?.keys(categories)?.map((category) =>
                        categories[category].length > 0 ?
                            (<div className={styles.listContainer} key={category}>
                                <center><h5>{category}</h5></center>
                                {categories[category].map((item, i) => {
                                    let jsx = '';
                                    if (Array.isArray(item.amount)) {
                                        jsx = item.amount.map((number, j) => (<React.Fragment key={item.name + j}><span>&nbsp;{parseFloat(number.toFixed(1))}&nbsp;{(item.unit[j]) === 'none' ? item.name : item.unit[j]}</span> <span style={{ display: `${showAddButton ? "inline" : "none"}` }}><FaRegEdit fill={"orange"} size={25} onClick={()=> handleEditItem(item)}/></span></React.Fragment>));

                                    }
                                    return (
                                        <li className={styles.li} key={item + i} id={item.name} data-category={category} data-item={JSON.stringify(item)}>
                                            <span>{item.name}</span>
                                            <span key={item.name + i} className={styles.itemAmount}>
                                                {Array.isArray(item.amount) ? jsx : (<React.Fragment><span>{parseFloat((item.amount).toFixed(1))}&nbsp;{item.unit === 'none' ? item.name : item.unit}</span><span style={{ display: `${showAddButton ? "inline" : "none"}`}}><FaRegEdit fill={"orange"} size={25} onClick={()=> handleEditItem(item)} className="mx-3"/></span></React.Fragment>)}
                                            </span>
                                           
                                        </li>
                                    )
                                })
                                }
                            </div>)
                            :
                            null
                    )
                }
            </div>
            <br />
            <center><Button style={{ display: `${showAddButton ? "inline" : "none"}` }} variant="success" onClick={async () => {
                await setShowForm(false);
                await setShowButton(false);
                window.print();

            }}>Print</Button>
                <Button style={{ display: `${showAddButton ? "inline" : "none"}` }} variant="success" onClick={handleShow}>Save</Button>
            </center>
        </React.Fragment>
    )

};

export default FinalList;