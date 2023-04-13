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

module.exports ={
    getRecipes
}