require('dotenv').config()
const connectionString = process.env.CONN_STRING

const pg = require('pg');
const client = new pg.Client(connectionString);
client.connect();

const applyMultipleFlters = (name, course, servings, allergen, protein, isUsers) => {
    let filters = '';

    if(isUsers === true)
        filters += 'WHERE author = $1';
    
    if (name) {
        if(!filters.length)
            filters += `WHERE name LIKE '%${name}%'`
        else
            `AND name LIKE '%${name}%'`
    }
    
    if (course) {
        course = course.split(',');

        for(let i = 0; i<course.length; i++){
            let courseFilter = course[i].replace(/([a-z])([A-Z])/g, '$1 $2')
            if(!filters.length){
                filters += `WHERE (course = '${courseFilter}'`
            }
            else if(i < 1){
                filters += ` AND (course = '${courseFilter}'`
            }
            else{
                filters += ` OR course = '${courseFilter}'`
            }
        }
        filters += ')';
    }
    if (servings) {
        servings = servings.split(',');

        for(let i = 0; i<course.length; i++){
            if(!filters.length){
                filters += `WHERE (servings = '${servings[i]}'`
            }
            else if(i < 1){
                filters += ` AND (servings = '${servings[i]}'`
            }
            else{
                filters += ` OR servings = '${servings[i]}'`
            }
        }
        filters += ')';
    }
    if (protein) {
        proteins = protein.split(',');
        
        for(let i = 0; i < proteins.length; i++){
            if(!filters.length){
                filters += `WHERE (('${proteins[i]}' = ANY (protein))`
            }
            else if(i < 1){
                filters += ` AND (('${proteins[i]}' = ANY (protein))`
            }
            else{
                filters += ` OR ('${proteins[i]}' = ANY (protein))`
            }
        }
        filters += ')';
    }
    if (allergen) {
        allergen = allergen.split(',');
        for(let i = 0; i < allergen.length; i++){
            if(!filters.length){
                filters += `WHERE NOT ('${allergen[i]}' = ANY (allergens))` 
            }
            else{
                filters += ` AND NOT ('${allergen[i]}' = ANY (allergens))`
            }
        }
    }

    return filters;
}

const applyPagination = (limit, offset) => {
    let pageFilter = ''

    if(limit){
        pageFilter += ` LIMIT '${limit}'`;
    }
    if(offset){
        pageFilter += ` OFFSET '${offset}'`;
    }

    return pageFilter;
}

const getRecipes = async (req,res)=>{
    try
    {
        const { name, course, servings, allergen, protein, limit, offset } = req.query;

        let getQuery = `SELECT * FROM recipes ${applyMultipleFlters(name, course, servings, allergen, protein, false)} ORDER BY added`

        getQuery += applyPagination(limit, offset)

        const response = await client.query(getQuery);
        res.status(200).json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const getRecipeByUser = async(req,res) => {
    try{
        const { name, course, servings, allergen, protein, limit, offset } = req.query;

        let getQuery = `SELECT * FROM recipes ${applyMultipleFlters(name, course, servings, allergen, protein, true)} ORDER BY added`

        getQuery += applyPagination(limit, offset)

        const response = await client.query(getQuery,[req.params.author]);
        res.status(200).json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const getRecipeById = async(req,res) => {
    try{
        const id = req.params.id;
        const response = await client.query('SELECT * FROM recipes WHERE recipe_id = $1',[id]);
        res.json(response.rows);
    }
    catch(error){
        res.send("Error: "+error);
    }
};

const createRecipe = async (req,res)=>{
    try{
        const {recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration, ingredients, steps} = req.body;

        let createQuery = 'INSERT INTO recipes(recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration, ingredients, steps, added)';
        createQuery += ' VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP::timestamp)';
        let createValues = [recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration, ingredients, steps];

        const response = await client.query(createQuery, createValues);
        res.status(200).json({
            message: 'Recipe Added Successfully',
            body:{
                recipe:{recipe_id, name, author, allergens, course, about, protein, ismeat, servings, ismins, duration, ingredients, steps}
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

        for (const column in updates) {
            const value = updates[column];
            values.push(value);
            updateClauses.push(`${column} = $${values.length}`);
        }
        
        query += updateClauses.join(', ');
        query += ` WHERE recipe_id = $${values.length + 1}`;
        values.push(req.params.id);
        
        const response = await client.query(query, values);
        res.status(200).json({
            message: 'Recipe updated successfully'
        });
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