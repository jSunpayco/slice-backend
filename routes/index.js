const { Router} =  require('express');
const router = Router();

const { getRecipes } = require('../controllers/index.controller');

router.get('/recipes',getRecipes);

module.exports = router;