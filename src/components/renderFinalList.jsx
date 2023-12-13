import React, { useState } from 'react';
import styles from './renderFinalList.module.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { isPlural } from '../utilities/findPlural';
import { numericQuantity } from 'numeric-quantity';


const FinalList = ({ categories, addItem }) => {
    const [showForm, setShowForm] = useState(false);
    const [showAddButton, setShowButton] = useState(true);
    const [errors, setErrors] = useState({});
    const handleItemName = (e) => {
        let name = e.target.value;
        if (isPlural(name)) {
            setErrors({ ...errors, itemName: 'Please enter ingredient name in singular form!' });
        } else if (name === '') {
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
    return (
        <React.Fragment>
            <Button variant="success" className="my-4" onClick={()=> setShowForm(true)} style={{display: `${showAddButton? "inline": "none"}`}}>Add Item</Button>

            <Form style={{display: `${showForm? "block" : "none"}`}} onSubmit={(e) => {
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
            {
                Object.keys(categories).map((category) =>
                    categories[category].length > 0 ?
                        (<ul key={category}>
                            <h5>{category}</h5>
                            {categories[category].map((item, i) => {
                                let jsx = '';
                                if (Array.isArray(item.amount)) {
                                    jsx = item.amount.map((number, j) => (<span key={item.name + j}>&nbsp;{parseFloat(number.toFixed(1))}&nbsp;{(item.unit[j]) === 'none' ? item.name : item.unit[j]}</span>));

                                }
                                return (
                                    <li className={styles.li} key={item + i} id={item.name} data-category={category} data-item={JSON.stringify(item)}>
                                        <span>{item.name}</span>
                                        <span key={item.name + i}>
                                            {Array.isArray(item.amount) ? jsx : (<span>{parseFloat((item.amount).toFixed(1))}&nbsp;{item.unit === 'none' ? item.name : item.unit}</span>)}
                                        </span>
                                    </li>
                                )
                            })
                            }
                        </ul>)
                        :
                        null
                )
            }
            <br/>
            <Button style={{display: `${showAddButton? "inline": "none"}`}} variant="success" onClick={async ()=> {
                await setShowForm(false);
                await setShowButton(false);
                window.print();
                
            }}>Print</Button>
        </React.Fragment>
    )

};

export default FinalList;