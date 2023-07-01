const { body, validationResult } = require('express-validator');

const express = require("express");
const router = express.Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe, updateRecipe, getRecipeByUser } = require('../controllers/index.controller');

router.use(express.json());

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.get('/myrecipes/:author',getRecipeByUser);

router.post(
    '/recipes',
    [
      body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long')
        .isLength({ max: 30 }).withMessage('Name cannot exceed 30 characters')
        .matches(/^[a-zA-Z0-9 ]+$/i).withMessage('Name can contain only letters and numbers')
        .trim()
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