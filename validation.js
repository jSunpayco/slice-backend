const { body } = require('express-validator');

const validAllergens = ["Fish", "Shellfish", "Milk", "Eggs", "Peanuts", "Tree Nuts", "Soy", "Gluten"];
const validCourses = ["Starter", "Breakfast", "Main Dish", "Side Dish", "Dessert"];
const validProteinsMeat = ["Beef", "Pork", "Poultry", "Fish", "Shellfish"];
const validProteinsVeg = ["Vegan", "Vegetarian"];
const validServings = ["1", "2", "3-4", "5-6", "7-10", "11+"];

const notIn = (values, validArr, message) => {
  const validSet = new Set(validArr)
  if(typeof values == "string"){
    if(!validSet.has(values))
      throw new Error(message);
  }else{
    for(const val of values){
      if(!validSet.has(val))
        throw new Error(message);
    }
  }
  return true;
}

const proteinValid = (values, validArr) => {
  const validSet = new Set(validArr)
  for(const val of values){
    if(!validSet.has(val))
      return false;
  }
  return true;
}

exports.validateRecipe = [
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long')
    .isLength({ max: 30 }).withMessage('Name cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9 ]+$/i).withMessage('Name can contain only letters and numbers')
    .trim(),
  body('about')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
    .isLength({ max: 100 }).withMessage('Description cannot exceed 100 characters')
    .matches(/^[a-zA-Z0-9 ]+$/i).withMessage('Description can contain only letters and numbers')
    .trim(),
  body('allergens')
    .optional()
    .isArray().withMessage('Allergens has an invalid format') // must be array
    .custom((values) => notIn(values, validAllergens, 'Invalid allergens detected'))
    .trim(),
  body('course')
    .notEmpty().withMessage('Course is required')
    .custom((values) => notIn(values, validCourses, 'Invalid course detected'))
    .trim(),
  body('protein')
    .notEmpty().withMessage('Protein is required')
    .isArray().withMessage('Protein has an invalid format') // must be array
    .custom((values) => {
      const isVeg = proteinValid(values, validProteinsVeg);
      const isMeat = proteinValid(values, validProteinsMeat);

      if(isMeat == false){
        if(isVeg == false)
          throw new Error('Invalid protein detected');
      }else{
        if(isMeat == false)
          throw new Error('Invalid protein detected');
      }

      if(isVeg == true && values.length === 2)
        throw new Error('Protein cannot be both Vegetarian and Vegan');

      return true;
    }),
  body('servings')
    .notEmpty().withMessage('Serving is required')
    .custom((values) => notIn(values, validServings, 'Invalid serving detected'))
    .trim(),
];