require('dotenv').config()
const connectionString = process.env.CONN_STRING

const pg = require('pg');
const client = new pg.Client(connectionString);
client.connect();

const getRecipes = async (req,res)=>{
    try
    {
        const response = await client.query('SELECT * FROM recipes');
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

module.exports ={
    getRecipes,
    getRecipeById,
    createRecipe
}