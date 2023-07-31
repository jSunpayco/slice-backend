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

  var newId = 0;

  beforeAll(done => {
    done()
  })
  
  afterAll(() => {
    setTimeout(() => {
      closeClient();
    }, 700);
  })

  test('create recipe with empty name', async () => {
    newRecipe.name = "";

    const response = await request(app).post('/recipes').send(newRecipe);
    expect(response.body.errors[0].msg).toEqual("Name is required");
  })

  test('create recipe with name less than 4 characters', async () => {
    newRecipe.name = "r2d";

    const response = await request(app).post('/recipes').send(newRecipe);
    expect(response.body.errors[0].msg).toEqual("Name must be at least 4 characters long");
  })

  test('create recipe with name more than 30 characters and symbols', async () => {
    newRecipe.name = "Mich@el Jack Son of the Gre@test Singing Clan";

    const response = await request(app).post('/recipes').send(newRecipe);
    expect(response.body.errors[0].msg).toEqual("Name cannot exceed 30 characters");
    expect(response.body.errors[1].msg).toEqual("Name can contain only letters and numbers");
  })

  test('creates a new recipe', async () => {
    newRecipe.name = "Earl Grey Ice Cream";
    const response = await request(app).post('/recipes').send(newRecipe);

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Recipe Added Successfully');
    newId = response.body.recipe_id;
  })

  test('updates the about column', async () => {
    const response = await request(app).put(`/recipes/${newId}`).send({
      updates:{about: "Homemade ice cream flavored with earl grey tea"}
    });

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Recipe updated successfully');
  });

  test('retrieves the new recipe', async () => {
    const response = await request(app).get(`/recipes/${newId}`);

    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].about).toEqual(updatedRecipe.about);
  });

  test('deletes the new recipe', async () => {
    const response = await request(app).delete(`/recipes/${newId}`);

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(`Recipe ${newId} deleted successfully`);
  });
});