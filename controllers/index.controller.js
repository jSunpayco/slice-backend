require('dotenv').config()
const connectionString = process.env.CONN_STRING

const pg = require('pg');
const client = new pg.Client(connectionString);
client.connect();

const getRecipes = async (req,res)=>{
    try
    {
        const { course, servings, allergen, protein, limit } = req.query;

        let filters = '';
        if (course) {
            let courseFilter = course.replace(/([a-z])([A-Z])/g, '$1 $2')
            filters += `WHERE course = '${courseFilter}'`;
        }
        if (servings) {
            filters += filters.length ? ` AND servings = '${servings}'` : `WHERE servings = '${servings}'`;
        }
        if (allergen) {
            allergens = allergen.split(',');
            allergenList = allergens.map((value) => filters.length ? ` AND NOT ('${value}' = ANY (allergens))` : `WHERE NOT ('${value}' = ANY (allergens))`).join(' ')
            filters += allergenList
        }
        if (protein) {
            proteins = protein.split(',');
            
            for(let i = 0; i < proteins.length; i++){
                if(!filters.length){
                    filters += `WHERE ('${proteins[i]}' = ANY (protein))`
                }
                else if(i < 1){
                    filters += ` AND ('${proteins[i]}' = ANY (protein))`
                }
                else{
                    filters += ` OR ('${proteins[i]}' = ANY (protein))`
                }
            }
        }
        if(limit){
            filters += `LIMIT '${limit}'`;
        }
        
        const response = await client.query(`SELECT * FROM recipes ${filters}`);
        res.status(200).json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const getRecipeById = async(req,res) => {
    try{
        const id = req.params.id;
        const sqlQuery = `SELECT *, 
                                (SELECT ARRAY_AGG(DISTINCT i.ingredient) 
                                FROM ingredients i 
                                WHERE i.recipe_id = r.recipe_id) AS ingredients,
                                (SELECT ARRAY_AGG(DISTINCT s.description) 
                                FROM steps s 
                                WHERE s.recipe_id = r.recipe_id) AS steps
                            FROM recipes r
                            WHERE r.recipe_id = $1;
                        `;
        const response = await client.query(sqlQuery,[id]);
        res.json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const getRecipeByUser = async(req,res) => {
    try{
        const author = req.params.author;
        const response = await client.query('SELECT * FROM recipes WHERE author = $1',[author]);
        res.json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const createRecipe = async (req,res)=>{
    try{
        const {recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration} = req.body;
        const response = await client.query('INSERT INTO recipes(recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration ]);
        res.status(200).json({
            message: 'Recipe Added Successfully',
            body:{
                recipe:{recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration}
            }
        });
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const deleteRecipe = async(req,res) =>{
    try{
        const id = req.params.id;
        const response = await client.query('DELETE FROM recipes WHERE recipe_id = $1',[id]);
        res.json(`Recipe ${id} deleted successfully`);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const updateRecipe = async(req,res) => {
    try{
        const { updates } = req.body;

        let query = 'UPDATE recipes SET ';
        const values = [];
        const updateClauses = [];

        updates.forEach((update, index) => {
            const { column, value } = update;
            values.push(value);
            updateClauses.push(`${column} = $${index + 1}`);
        });

        query += updateClauses.join(', ');
        query += ' WHERE recipe_id = $' + (updates.length + 1);
        values.push(req.params.id);
        
        const response = await client.query(query,values);
        res.json('Recipe updated successfully');
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const closeClient = () => {
    client.end();
}

module.exports ={
    getRecipes,
    getRecipeById,
    createRecipe,
    deleteRecipe,
    updateRecipe,
    getRecipeByUser,
    closeClient
}