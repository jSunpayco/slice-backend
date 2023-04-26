const request = require("supertest");
const express = require("express");
const app = new express();
app.use(require('../routes/index'));
const {closeClient} = require('../controllers/index.controller');

describe('All tests', () => {

  beforeAll(done => {
    done()
  })
  
  afterAll(() => {
    closeClient();
  })

  test('creates a new recipe', async () => {
    const newRecipe = {
      recipe_id: 21,
      author: "RubberyTurnip",
      name: "Earl Grey Ice Cream",
      allergens: ["Milk", "Eggs"],
      course: "Dessert",
      about: "Homemade ice cream flavored with tea",
      protein: [
          "Vegan"
      ],
      ismeat: false,
      servings: "5-6",
      ismins: false,
      duration: "2"
    }

    const dataString = JSON.stringify(newRecipe);
    const contentLength = Buffer.byteLength(dataString, 'utf8');

    const response = await request(app).post('/recipes')
      .set('Content-Type', 'application/json').set('Content-Length', contentLength).send(newRecipe);

    expect(response.statusCode).toBe(200)
    expect(response.body.body.recipe).toEqual(newRecipe);
  })

  test('responds with list of recipes', async () => {
    const response = await request(app).get('/recipes');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('recipe_id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('author');
  });
});