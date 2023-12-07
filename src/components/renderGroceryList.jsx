const GroceryList = ({ groceries, categorize }) => {
    // Displays grocery list items
    let groceryList = Object.entries(groceries);

    let renderList = groceryList.map((grocery, i) => {
        let jsx = '';
        if (Array.isArray(grocery[1].amount)) {
            jsx = grocery[1].amount.map((number, j) => (<span key={grocery[0][j]}>&nbsp;{parseFloat(number.toFixed(1))}&nbsp;{(grocery[1].unit[j]) === 'none' ? grocery[0] : grocery[1].unit[j]}</span>));
        }
        return (
            <li key={grocery[0] + i} id={grocery[0]} style={{ listStyleType: "none", padding: "10px", color: "darkgreen", fontWeight: "bold", border: "2px solid black", margin: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{grocery[0]}</span>
                <span>
                    {Array.isArray(grocery[1].amount) ? jsx : <span>{parseFloat(grocery[1].amount.toFixed(1))}&nbsp;{grocery[1].unit === 'none' ? grocery[0] : grocery[1].unit}</span>}
                </span>
            </li>
        )
    })
    return (
        <ul onClick={categorize}>
            {renderList}
        </ul>
    )
};

export default GroceryList;