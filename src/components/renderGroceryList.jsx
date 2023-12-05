const GroceryList = ({groceries}) => {
    // Displays grocery list items
    let groceryList = Object.entries(groceries);
    
    return groceryList.map((grocery, i )=> {
        let jsx = '';
        if (Array.isArray(grocery[1].amount)) {
            jsx = grocery[1].amount.map((number, i) => (<div key={i + grocery[0]}>{parseFloat(number.toFixed(1))}&nbsp;{(grocery[1].unit[i]) === 'none'? grocery[0]: grocery[1].unit[i] }</div>));
        } 
    
        return (<li key={i + grocery[0]} style={{ listStyleType: "none", padding: "10px", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>{grocery[0]}</div>
        <div>
            {Array.isArray(grocery[1].amount)? jsx : <span>{parseFloat(grocery[1].amount.toFixed(1))}&nbsp;{grocery[1].unit === 'none'?grocery[0]: grocery[1].unit }</span>}
            
        </div>
        </li>
    )  } )
};

export default GroceryList;