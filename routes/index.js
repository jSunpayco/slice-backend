const { Router} =  require('express');
const router = Router();

const { getRecipes, getRecipeById, createRecipe } = require('../controllers/index.controller');

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);
router.post('/recipes',createRecipe);

module.exports = router;