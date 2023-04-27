const request = require("supertest");
const express = require("express");
const app = new express();
app.use(require('../routes/index'));
const {closeClient} = require('../controllers/index.controller');

describe('All tests', () => {

  const newRecipe = {
    recipe_id: 21,
    author: "RubberyTurnip",
    name: "Earl Grey Ice Cream",
    allergens: ["Milk", "Eggs"],
    course: "Dessert",
    about: "Homemade ice cream flavored with tea",
    protein: [
        "Vegetarian"
    ],
    ismeat: false,
    servings: "5-6",
    ismins: false,
    duration: "2"
  }

  const updatedRecipe = {
    recipe_id: 21,
    author: "RubberyTurnip",
    name: "Earl Grey Ice Cream",
    allergens: ["Milk", "Eggs"],
    course: "Dessert",
    about: "Homemade ice cream flavored with tea",
    protein: [
        "Vegetarian"
    ],
    ismeat: false,
    servings: "5-6",
    ismins: false,
    duration: "2"
  }

  beforeAll(done => {
    done()
  })
  
  afterAll(() => {
    closeClient();
  })

  test('creates a new recipe', async () => {
    const response = await request(app).post('/recipes').send(newRecipe);

    expect(response.statusCode).toBe(200)
    expect(response.body.body.recipe).toEqual(newRecipe);
  })

  test('retrieves the new recipe', async () => {
    const response = await request(app).get('/recipes/21');

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(newRecipe);
  });

  test('updates the servings from 5-6 to 3-4', async () => {
    const response = await request(app).put('/recipes/21').send(updatedRecipe);

    expect(response.statusCode).toBe(200)
    expect(response.body.body.recipe).toEqual('Recipe updated successfully');
  });
});