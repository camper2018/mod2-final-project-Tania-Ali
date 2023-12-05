
export const dryConversionFactors = {
  'tsp': 1,
  'tbsp': 3,
  'oz': 6,
  'cup': 48,
  'lb': 96,
};

export const metricDryConversionFactors = {
  'mg': 1,
  'g': 1000,
  'kg': 1000000
};

export function getUnitSystemForDry (unit){
  let unitSystem = '';
  if (unit in dryConversionFactors){
    unitSystem = 'customary';
  } else if (unit in metricDryConversionFactors) {
    unitSystem = 'metric';
  } else {
    unitSystem = 'unknown'
  }
  return unitSystem;
}

export function addDryIngredients(ingredients, conversionFactorType) {
   let conversionFactors;
   switch(conversionFactorType){
    case('metric'):
      conversionFactors = metricDryConversionFactors;
      break;
    case('customary'):
      conversionFactors = dryConversionFactors;
      break;
    default:
      console.log('Please enter a valid unit system, metric or customary!', ingredients);
      return;
    
   }
   // Convert each ingredient to teaspoons and sum them up
    const totalAmountInSmallestUnit = ingredients.reduce((total, { amount, unit }) => {
      const conversionFactor = conversionFactors[unit] || 0;
      return total + amount * conversionFactor;
    }, 0);

    // Determine the largest possible unit for the result
    const units = Object.keys(conversionFactors).reverse(); // Start with the largest unit
    let resultAmount = totalAmountInSmallestUnit;

    for (const unit of units) {
      const conversionFactor = conversionFactors[unit];
      const unitAmount = resultAmount / conversionFactor;
      
      if (unitAmount >= 1) {
        resultAmount = unitAmount;
        return {amount: resultAmount, unit: unit,  };
      }
    }
    // If the result is less than 1, return in smallest unit

    return { amount: resultAmount, unit: Object.keys(conversionFactors)[0] };
}

// example
const ingredients = [
    { amount: 1, unit: 'oz', type: 'dry' },
    { amount: 2, unit: 'cloves', type: 'dry' },
    { name: "garlic", amount: 1.5, unit: "cup", type: "dry" },
    { amount: 3, unit: 'tsp' },
    {name: 'all-purpose-flour', amount: 14, unit: 'cup', type: 'dry'}
];
  
const metricIngredients = [
    // { amount: 340.19, unit: 'g' },
    { amount: 2, unit: 'none' },
    { amount: 198.45, unit: 'g' },
    // { amount: 340.19, unit: 'g' },
];
const customary = [
    { name: "tomato sauce", amount: "12", unit: "oz", type: "dry" },
    { name: "tomato sauce", amount: "2", unit: "tbsp", type: "dry"},
    { name: "tomato sauce", amount:"12", unit: "oz", type: "dry"},
    { name: "tomato sauce", amount: "2", unit: "tbsp", type: "dry"},
];
 
// console.log(addDryIngredients(metricIngredients, 'metric'));
  
// console.log(addDryIngredients(ingredients, 'customary'));



// console.log(addDryIngredients(customary, 'customary'));
