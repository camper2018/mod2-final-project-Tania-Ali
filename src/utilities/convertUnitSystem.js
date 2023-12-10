import { addDryIngredients} from './addDryIngredients.js';
import { addWetIngredients } from './addWetIngredients.js';
import { numericQuantity } from 'numeric-quantity';
const metricDryConversionFactors = {
    'tsp': { unit: 'g', factor: 5.69 },
    'tbsp': { unit: 'g', factor: 14.175 },
    'oz': { unit: 'g', factor: 28.35 },
    'cup': { unit: 'g', factor: 240 },
    'lb': { unit: 'g', factor: 453.592 },
};
const metricWetConversionFactors = {
    'tsp': { unit: 'mL', factor: 4.929 },
    'tbsp': { unit: 'mL', factor: 14.78 },
    'fl oz': { unit: 'mL', factor: 29.574 },
    'cup': { unit: 'mL', factor: 236.588 },
    'pt': { unit: 'mL', factor: 568.261 },
    'qt': { unit: 'mL', factor: 946.353 },
    'gal': { unit: 'L', factor: 3.78541 },
};

const customaryDryConversionFactors = {
    'mg': { unit: 'tsp', factor: 0.000202},
    'g': { unit: 'tsp', factor: 0.202 },
    'kg': { unit: 'lb', factor: 2.205 },
};
const customaryWetConversionFactors = {
    'mL': { unit: 'tsp', factor: 0.203 },
    'L': { unit: 'qt', factor: 1.057 },
};
const convertUnitHelper = (amount, unit, conversionFactors)=> {
    if (unit in conversionFactors) {
        const conversionInfo = conversionFactors[unit];
        const convertedValue = amount * conversionInfo.factor;
        return {
            amount: convertedValue,
            unit: conversionInfo.unit,
        };
    } else {
        return {
            amount: amount,
            unit: unit,
        };
    }
}

/**************** Convert customary units to metric units******************/

export const convertCustomaryToMetric = (ingredients)=> {
   return ingredients.map(ingredient => {
    let ingredientType = ingredient.type;
    let conversionFactors;
    switch(ingredientType){
     case('dry'):
       conversionFactors = metricDryConversionFactors;
       break;
     case('wet'):
       conversionFactors = metricWetConversionFactors;
       break;
     default:
       console.log('Please enter ingredient type, wet or dry!', ingredients);
       return;
     
    }
    let result = convertUnitHelper(parseFloat(numericQuantity(ingredient.amount)), ingredient.unit, conversionFactors);
    const addIngredients = ingredient.type === 'dry'? addDryIngredients: addWetIngredients
    let updatedResult = addIngredients([result], 'metric');
   
    if (updatedResult.amount !== 0) {
        result.amount = updatedResult.amount;
        result.unit = updatedResult.unit;
    }
    ingredient.amount = result.amount.toFixed(2);
    ingredient.unit = result.unit;
    return ingredient; 
   })
};
/**************** find unit system for a recipe ************************/
export const findUnitSystem = (recipe) => {
    let count = 0;
    let found = true;
    let unitSystem;
    while( found && count < recipe.ingredients.length) {
       if (recipe.ingredients[count].unit in metricDryConversionFactors || recipe.ingredients[0].unit in metricWetConversionFactors){
         unitSystem = 'customary';
         found = false;
       } else if (recipe.ingredients[count].unit in customaryDryConversionFactors || recipe.ingredients[0].unit in customaryWetConversionFactors){
         unitSystem = 'metric';
         found = false;
       } else {
        count++
       }
    }
    return unitSystem? unitSystem: 'customary';
}
/**************** Convert Metric units to Customary units ******************/
export const convertMetricToCustomary = (ingredients)=> {
    return ingredients.map(ingredient => {
     let ingredientType = ingredient.type;
     let conversionFactors;
     switch(ingredientType){
      case('dry'):
        conversionFactors = customaryDryConversionFactors;
        break;
      case('wet'):
        conversionFactors = customaryWetConversionFactors;
        break;
      default:
        console.log('Please enter ingredient type, wet or dry!', ingredients);
        return;
      
     }
    let result = convertUnitHelper(parseFloat(numericQuantity(ingredient.amount)), ingredient.unit, conversionFactors);
    const addIngredients = ingredient.type === 'dry'? addDryIngredients: addWetIngredients
    let updatedResult = addIngredients([result], 'customary');
    if (updatedResult.amount !== 0) {
        result.amount = updatedResult.amount;
        result.unit = updatedResult.unit;
    }
    ingredient.amount = (result.amount).toFixed(2);
    ingredient.unit = result.unit;
    return ingredient; 
    })
 }


