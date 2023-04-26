const express = require("express");
const router = express.Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe, updateRecipe, getRecipeByUser } = require('../controllers/index.controller');

router.use(express.json());

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.get('/myrecipes/:author',getRecipeByUser);
router.post('/recipes',createRecipe);
router.delete('/recipes/:id',deleteRecipe);
router.put('/recipes/:id',updateRecipe);

module.exports = router;