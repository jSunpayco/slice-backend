const { validationResult } = require('express-validator');
const { validateRecipe } = require('../validation')

const express = require("express");
const router = express.Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe, updateRecipe, getRecipeByUser } = require('../controllers/index.controller');

router.use(express.json());

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.get('/myrecipes/:author',getRecipeByUser);

router.post(
    '/recipes', validateRecipe,
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