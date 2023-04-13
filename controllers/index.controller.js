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

module.exports ={
    getRecipes,
    getRecipeById
}