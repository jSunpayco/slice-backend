const { body, validationResult } = require('express-validator');

const express = require("express");
const router = express.Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe, updateRecipe, getRecipeByUser } = require('../controllers/index.controller');

router.use(express.json());

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.get('/myrecipes/:author',getRecipeByUser);

const validAllergens = ["Fish", "Shellfish", "Milk", "Eggs", "Peanuts", "Tree Nuts", "Soy", "Gluten"];
const validCourses = ["Starter", "Breakfast", "Main Dish", "Side Dish", "Dessert"];
const validProteins = ["Beef", "Pork", "Poultry", "Fish", "Shellfish", "Vegan", "Vegetarian"];
const validServings = ["1", "2", "3-4", "5-6", "7-10", "11+"];

router.post(
    '/recipes',
    [
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
        .isArray().withMessage('Allergens must be an array')
        .isIn([validAllergens]).withMessage('Invalid allergens detected'),
      body('course')
        .notEmpty().withMessage('Course is required')
        .isIn([validCourses]).withMessage('Invalid course detected')
        .trim(),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      createRecipe(req, res);
    }
);

router.delete('/recipes/:id',deleteRecipe);
router.put('/recipes/:id',updateRecipe);

module.exports = router;