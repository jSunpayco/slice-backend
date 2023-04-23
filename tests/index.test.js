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

  test('responds with list of recipes', async () => {
    const response = await request(app).get('/recipes');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('recipe_id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('author');
  });
});