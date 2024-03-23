import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './renderFinalList.module.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { numericQuantity } from 'numeric-quantity';
import { IoHome } from "react-icons/io5";
import Modal from 'react-bootstrap/Modal';
import EditableTextItem from './editableTextItem';
import { FaTrash } from "react-icons/fa";
const FinalList = ({ categories, addItem, handleSavedLists}) => {
    const [showForm, setShowForm] = useState(false);
    const [showAddButton, setShowButton] = useState(true);
    const [errors, setErrors] = useState({});
    const [showListForm, setShowListForm] = useState(false);
    const handleClose = () => setShowListForm(false);
    const handleShow = () => setShowListForm(true);

    const navigate = useNavigate();
    // form error handlers
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
    // saves a grocery list
    const handleSaveList = (e) => {
        e.preventDefault();
        const myLists = localStorage.getItem("myLists")? JSON.parse(localStorage.getItem("myLists")) : [];
        const isDuplicate = myLists.some(list => list.title === e.target[0].value);
        if (!isDuplicate) {
            myLists.push({ title: e.target[0].value, categories: categories });
            localStorage.setItem('myLists', JSON.stringify(myLists));
            setErrors({ ...errors, duplicate: null });
            handleClose();
            navigate("/")
            location.reload();
        } else {
            setErrors({...errors, duplicate: "Duplicate title! Please enter unique title"});
        }
    }
   
    // edits an item in the list 
    const handleEditItem = (prev, current, id)=> {
        console.log("prev:", prev, "current:", current, "id:", id)
        const categoriesCopy = {...categories};
        const [type, category, index, subIdx] = id.split("-");
        const targetValue = categoriesCopy[category][index];
        if (type === "name"){
          targetValue.name = current;
          handleSavedLists(categoriesCopy);
        } else {
          if (Array.isArray(targetValue)){
            targetValue[type][subIdx] = type === "amount" ? parseFloat(current): current;
          } else {
            targetValue[type] = type === "amount" ? parseFloat(current): current;
          }
        }
        handleSavedLists(categoriesCopy);
    }
    // deletes an item in the list
    const handleDeleteItem = (category, index) => {
       const categoriesCopy = {...categories};
       categories[category].splice(index, 1);
       handleSavedLists(categoriesCopy);
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
            <Button style={{ display: `${showAddButton ? "inline" : "none"}` }} variant="warning" onClick={() => {
                navigate('/');
                window.location.reload();
            }}><IoHome fill="white" size={25} /></Button>
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
            <div style={showAddButton ? { height: "60vh", overflowY: "scroll" } : { overflowY: "visible" }}>
                {
                    Object?.keys(categories)?.map((category, i) =>
                        categories[category].length > 0 ?
                            (<div className={styles.listContainer} key={category}>
                              <center><h6 className={styles.categoryText}>{category}</h6></center>
                                {categories[category].map((item, i) => {
                                    let jsx = '';
                                    if (Array.isArray(item.amount)) {
                                           jsx = item.amount.map((number, j)=> (<React.Fragment  key={item.name + i + j}>&nbsp;&nbsp;&nbsp;<EditableTextItem id={"amount"+"-"+category+"-"+i+"-"+j} initialText={parseFloat((number.toFixed(1)))} handleEdit={handleEditItem} className={styles.editableTextInput}/>&nbsp;<EditableTextItem id={"unit"+"-"+category+"-"+i+"-"+j} initialText={(item.unit[j]) === 'none' ? item.name : item.unit[j]} handleEdit={handleEditItem} className={styles.editableTextInput}/></React.Fragment>))
                                    }
                                    return (
                                        <li className={styles.li} key={category + item.name + i} id={item.name} data-category={category} data-item={JSON.stringify(item)}>
                                            <EditableTextItem initialText={item.name} id={"name"+"-"+category+"-"+i} handleEdit={handleEditItem} className={styles.editableTextInput}/>
                                            <span className={styles.itemAmount}>
                                                {Array.isArray(item.amount) ? jsx : (<React.Fragment>&nbsp;&nbsp;&nbsp;<EditableTextItem id={"amount"+"-"+category+"-"+i} initialText={parseFloat(((item.amount).toFixed(1)))} handleEdit={handleEditItem} className={styles.editableTextInput}/>&nbsp; <EditableTextItem id={"unit"+"-"+category+"-"+i} initialText={item.unit === 'none' ? item.name : item.unit} handleEdit={handleEditItem} className={styles.editableTextInput}/></React.Fragment>)}
                                                <FaTrash className="ms-3"size={22} fill="red" style={{ display: `${showAddButton ? "inline" : "none"}`}} onClick={()=> handleDeleteItem(category, i)}/>
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
            <div className="d-flex w-100 justify-content-evenly">
                <Button 
                    style={{ width: "100px", display: `${showAddButton ? "inline" : "none"}` }} variant="success" 
                    onClick={async (e) => {
                    e.preventDefault();
                    await setShowForm(false);
                    await setShowButton(false);
                    window.print();
                    await setShowButton(true);
                    
                 }}>
                Print</Button>
                <Button style={{ width: "100px", display: `${showAddButton ? "inline" : "none"}` }} variant="success" onClick={handleShow}>Save</Button>
            </div>
        </React.Fragment>
    )

};

export default FinalList;