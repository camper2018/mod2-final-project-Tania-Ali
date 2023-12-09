import React from 'react';
const FinalList = ({ categories }) => {
    return (
        <React.Fragment>
            {
                Object.keys(categories).map((category) =>
                    categories[category].length > 0 ?
                        (<ul key={category}>
                            <h3>{category}</h3>
                            {categories[category].map((item, i) => {
                                let jsx = '';
                                if (Array.isArray(item.amount)){
                                   jsx = item.amount.map((number, j) => (<span key={item.name + j}>&nbsp;{parseFloat(number.toFixed(1))}&nbsp;{(item.unit[j]) === 'none' ? item.name : item.unit[j]}</span>));
    
                                }
                             return    (
                                <li key={item + i} id={item} style={{ listStyleType: "none", padding: "10px", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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