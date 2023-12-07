import React from 'react';
const FinalList = ({ categories }) => {
    return (
        <React.Fragment>
            {
                Object.keys(categories).map((category) =>
                    categories[category].length > 0 ?
                        (<ul key={category}>
                            <h3>{category}</h3>
                            {categories[category].map((item, i) => (
                                <li key={item + i} id={item} style={{ listStyleType: "none", padding: "10px", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>{item.name}</span>
                                    <span>
                                        {parseFloat(item.amount.toFixed(1))}&nbsp;{item.unit === 'none' ? item.name : item.unit}
                                    </span>
                                </li>
                            ))
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