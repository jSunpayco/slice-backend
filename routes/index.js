const { Router} =  require('express');
const router = Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe, updateRecipe, getRecipeByUser } = require('../controllers/index.controller');

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.get('/myrecipes/:author',getRecipeByUser);
router.post('/recipes',createRecipe);
router.delete('/recipes/:id',deleteRecipe);
router.put('/recipes/:id',updateRecipe);

module.exports = router;