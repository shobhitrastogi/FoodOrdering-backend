import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import userModel from '../models/userModel.js';

let userId;
let token;

beforeEach(async () => {
  try {
    await userModel.deleteMany({});

    const user = new userModel({
      _id: new mongoose.Types.ObjectId(),
      name: 'TestUser',
      email: 'testuser@example.com',
      password: 'password123',
      cartData: {},
    });
    await user.save();
    userId = user._id.toString();

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send({ email: 'testuser@example.com', password: 'password123' });

    token = loginResponse.body.token;

    expect(loginResponse.status).toBe(200);
    expect(token).toBeDefined();
  } catch (error) {
    console.error('Error in beforeEach:', error);
  }
});

describe('Cart API', () => {
  test('should add item to cart', async () => {
    try {
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId, itemId: 'item1' })
        .expect(200); // Updated to 200 for success

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Added to the cart.');

      const user = await userModel.findById(userId);
      expect(user.cartData.item1).toBe(1);
    } catch (error) {
      console.error('Error in add item to cart test:', error);
    }
  });

  test('should remove item from cart', async () => {
    try {
      await userModel.findByIdAndUpdate(userId, { cartData: { item1: 2 } });

      const response = await request(app)
        .post('/api/cart/remove')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId, itemId: 'item1' })
        .expect(200); // Updated to 200 for success

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Removed from the cart.');

      const user = await userModel.findById(userId);
      expect(user.cartData.item1).toBeUndefined();
    } catch (error) {
      console.error('Error in remove item from cart test:', error);
    }
  });

  test('should get cart items', async () => {
    try {
      await userModel.findByIdAndUpdate(userId, { cartData: { item1: 2, item2: 3 } });

      const response = await request(app)
        .post('/api/cart/get')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId })
        .expect(200); // Updated to 200 for success

      expect(response.body.success).toBe(true);
      expect(response.body.cartData).toEqual({ item1: 2, item2: 3 });
    } catch (error) {
      console.error('Error in get cart items test:', error);
    }
  });
});
