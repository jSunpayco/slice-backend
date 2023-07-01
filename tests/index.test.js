const request = require("supertest");
const express = require("express");
const app = new express();
app.use(require('../routes/index'));
const {closeClient} = require('../controllers/index.controller');

describe('All tests', () => {

  const newRecipe = {
    author: "RubberyTurnip",
    name: "Earl Grey Ice Cream",
    allergens: ["Milk", "Eggs"],
    course: "Dessert",
    about: "Ice cream flavored with tea",
    protein: [
        "Vegetarian"
    ],
    ismeat: false,
    servings: "5-6",
    ismins: false,
    duration: "2",
    steps: ["Mix Milk", "Mix Eggs", "Add Vanilla", "Freeze"],
    ingredients: ["Milk", "Eggs", "Vanilla"],
    image: "rubberyturnip_earl_gray_ice_cream"
  }

  const updatedRecipe = {
    author: "RubberyTurnip",
    name: "Earl Grey Ice Cream",
    allergens: ["Milk", "Eggs"],
    course: "Dessert",
    about: "Homemade ice cream flavored with earl grey tea",
    protein: [
        "Vegetarian"
    ],
    ismeat: false,
    servings: "5-6",
    ismins: false,
    duration: "2",
    steps: ["Mix Milk", "Mix Eggs", "Add Vanilla", "Freeze"],
    ingredients: ["Milk", "Eggs", "Vanilla"],
    image: "rubberyturnip_earl_gray_ice_cream"
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

  test('updates the about column', async () => {
    const response = await request(app).put('/recipes/9999').send({
      updates:{about: "Homemade ice cream flavored with earl grey tea"}
    });

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Recipe updated successfully');
  });

  test('retrieves the new recipe', async () => {
    const response = await request(app).get('/recipes/9999');

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].about).toEqual(updatedRecipe.about);
  });

  test('deletes the new recipe', async () => {
    const response = await request(app).delete('/recipes/9999');

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual('Recipe 9999 deleted successfully');
  });
});