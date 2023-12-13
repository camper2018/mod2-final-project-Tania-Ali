import React from 'react';
import styles from './renderFinalList.module.css';
const FinalList = ({ categories }) => {
    return (
        <React.Fragment>
            {
                Object.keys(categories).map((category) =>
                    categories[category].length > 0 ?
                        (<ul key={category}>
                            <h5>{category}</h5>
                            {categories[category].map((item, i) => {
                                let jsx = '';
                                if (Array.isArray(item.amount)){
                                   jsx = item.amount.map((number, j) => (<span key={item.name + j}>&nbsp;{parseFloat(number.toFixed(1))}&nbsp;{(item.unit[j]) === 'none' ? item.name : item.unit[j]}</span>));
    
                                }
                             return    (
                                <li className={styles.li} key={item + i} id={item.name} data-category={category} data-item={JSON.stringify(item)}>
                                    <span>{item.name}</span>
                                    <span  key={item.name + i}>
                                     {Array.isArray(item.amount)? jsx: (<span>{parseFloat((item.amount).toFixed(1))}&nbsp;{item.unit === 'none' ? item.name : item.unit}</span>)}
                                    </span>
                                </li>
                            )})
                            }
                        </ul>)
                        :
                        null
                )
            }
        </React.Fragment>
    )

};

export default FinalList;