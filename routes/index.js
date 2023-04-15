const { Router} =  require('express');
const router = Router();

const { getRecipes, getRecipeById, createRecipe, deleteRecipe } = require('../controllers/index.controller');

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.post('/recipes',createRecipe);
router.delete('/recipes/:id',deleteRecipe);

module.exports = router;