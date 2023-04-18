require('dotenv').config()
const connectionString = process.env.CONN_STRING

const pg = require('pg');
const client = new pg.Client(connectionString);
client.connect();

const getRecipes = async (req,res)=>{
    try
    {
        const { course, servings } = req.query;

        let filters = '';
        if (course) {
            let courseFilter = course.replace(/([a-z])([A-Z])/g, '$1 $2')
            filters += `WHERE course = '${courseFilter}'`;
        }
        if (servings) {
            filters += filters.length ? ` AND servings = '${servings}'` : `WHERE servings = '${servings}'`;
        }

        const response = await client.query(`SELECT * FROM recipes ${filters}`);
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};

const getRecipeById = async(req,res) => {
    const id = req.params.id;
    const response = await client.query('SELECT * FROM recipes WHERE recipe_id = $1',[id]);
    res.json(response.rows);
};

const getRecipeByUser = async(req,res) => {
    const author = req.params.author;
    const response = await client.query('SELECT * FROM recipes WHERE author = $1',[author]);
    res.json(response.rows);
};

const createRecipe = async (req,res)=>{
    const {recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration} = req.body;
    const response = await client.query('INSERT INTO recipes(recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration ]);
    // console.log(response);
    res.json({
        message: 'Recipe Added Successfully',
        body:{
            recipe:{recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration}
        }
    });
};

const deleteRecipe = async(req,res) =>{
    const id = req.params.id;
    const response = await client.query('DELETE FROM recipes WHERE recipe_id = $1',[id]);
    res.json(`Recipe ${id} deleted successfully`);
};

const updateRecipe = async(req,res) => {
    const id = req.params.id;
    const {recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration} = req.body;
    const response = await client.query('UPDATE recipes SET name = $2, author=$3, allergens=$4, course=$5, about=$6, protein=$7, ismeat=$8, servings=$9, ismins=$10, duration=$11 WHERE recipe_id = $1',[recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration]);
    console.log(response);
    res.json('Recipe updated successfully');
};

module.exports ={
    getRecipes,
    getRecipeById,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    getRecipeByUser
}