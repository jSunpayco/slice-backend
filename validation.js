const { body } = require('express-validator');

const validAllergens = ["Fish", "Shellfish", "Milk", "Eggs", "Peanuts", "Tree Nuts", "Soy", "Gluten"];
const validCourses = ["Starter", "Breakfast", "Main Dish", "Side Dish", "Dessert"];
const validProteinsMeat = ["Beef", "Pork", "Poultry", "Fish", "Shellfish", "Vegan", "Vegetarian"];
const validProteinsVeg = ["Vegan", "Vegetarian"];
const validServings = ["1", "2", "3-4", "5-6", "7-10", "11+"];

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
    .isIn([validAllergens]).withMessage('Invalid allergens detected'),
  body('course')
    .notEmpty().withMessage('Course is required')
    .isIn([validCourses]).withMessage('Invalid course detected')
    .trim(),
  body('protein')
    .notEmpty().withMessage('Protein is required')
    .isArray().withMessage('Protein has an invalid format') // must be array
    .custom((value) => {
      const validProtein = value.some((protein) =>
        validProteinsMeat.includes(protein) || validProteinsVeg.includes(protein)
      );

      if (!validProtein)
        throw new Error('Invalid protein detected');

      const inBothProtein = value.some((protein) =>
        validProteinsMeat.includes(protein) && validProteinsVeg.includes(protein)
      );

      if (inBothProtein)
        throw new Error('Protein must either contain meat or not');

      if(value.length === 2 && validProteinsVeg.includes(value[0]) && validProteinsVeg.includes(value[1]))
        throw new Error('Protein cannot be both Vegetarian and Vegan');

      return true;
    }),
    body('servings')
      .notEmpty().withMessage('Serving is required')
      .isIn([validServings]).withMessage('Invalid serving detected')
      .trim(),
];