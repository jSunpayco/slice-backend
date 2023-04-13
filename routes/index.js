const { Router} =  require('express');
const router = Router();

const { getRecipes, getRecipeById } = require('../controllers/index.controller');

router.get('/recipes',getRecipes);
router.get('/recipes/:id',getRecipeById);

module.exports = router;