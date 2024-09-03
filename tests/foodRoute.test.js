import request from 'supertest';
import app from '../app';
import foodModel from '../models/foodModel.js';
import path from 'path';  // Required for file paths

describe('Food Routes', () => {
  let foodId;

  // Test POST /api/food/add
  it('should add a new food item', async () => {
    const response = await request(app)
      .post('/api/food/add')
      .attach('image', path.resolve(__dirname, '../uploads/pizza.jpg'))  // Ensure this path is correct
      .field('name', 'Pizza')
      .field('description', 'Delicious cheese pizza')
      .field('price', 12.99)
      .field('category', 'Main Course');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Food added');

    const food = await foodModel.findOne({ name: 'Pizza' });
    foodId = food._id.toString();
  }, 30000);  // Increase timeout if needed

  // Test GET /api/food/list
  it('should list all food items', async () => {
    const response = await request(app).get('/api/food/list');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test POST /api/food/remove
  it('should remove a food item', async () => {
    const response = await request(app)
      .post('/api/food/remove')
      .send({ id: foodId });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Food removed');

    const food = await foodModel.findById(foodId);
    expect(food).toBeNull();
  });
});
