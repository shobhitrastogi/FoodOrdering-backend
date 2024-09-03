const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary
// const userModel = require('../models/userModel'); // Adjust the path as necessary
const Order = require('../models/Order'); // Adjust the path as necessary

import userModelModel from '../models/userModelModel.js';
beforeAll(async () => {
  // Connect to the database or setup necessary data
});

beforeEach(async () => {
  // Clear previous orders and userModels or create a new userModel for testing
  await userModel.deleteMany({});
  await Order.deleteMany({});
  
  // Create a test userModel
  await userModel.create({
    email: 'testuserModel@example.com',
    password: 'password123',
    // any other fields as necessary
  });
});

afterAll(async () => {
  // Close the database connection
});

describe('Order API', () => {
  let token;

  beforeEach(async () => {
    // Log in the userModel to get a token
    const response = await request(app)
      .post('/api/auth/login') // Adjust the path as necessary
      .send({
        email: 'testuserModel@example.com',
        password: 'password123',
      });

    token = response.body.token;
  });

  test('should create a new order', async () => {
    const orderData = {
      items: [
        { productId: '12345', quantity: 2 },
        { productId: '67890', quantity: 1 },
      ],
      total: 50.0,
    };

    const response = await request(app)
      .post('/api/orders') // Adjust the path as necessary
      .set('Authorization', `Bearer ${token}`)
      .send(orderData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('order');
    expect(response.body.order.total).toBe(orderData.total);
  });

  test('should retrieve an order by ID', async () => {
    const order = await Order.create({
      userModelId: 'testuserModel@example.com',
      items: [
        { productId: '12345', quantity: 2 },
      ],
      total: 40.0,
    });

    const response = await request(app)
      .get(`/api/orders/${order._id}`) // Adjust the path as necessary
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('order');
    expect(response.body.order._id).toBe(order._id.toString());
  });

  test('should update an order', async () => {
    const order = await Order.create({
      userModelId: 'testuserModel@example.com',
      items: [
        { productId: '12345', quantity: 1 },
      ],
      total: 20.0,
    });

    const updatedOrderData = {
      items: [
        { productId: '12345', quantity: 3 },
      ],
      total: 60.0,
    };

    const response = await request(app)
      .put(`/api/orders/${order._id}`) // Adjust the path as necessary
      .set('Authorization', `Bearer ${token}`)
      .send(updatedOrderData);

    expect(response.status).toBe(200);
    expect(response.body.order.total).toBe(updatedOrderData.total);
    expect(response.body.order.items[0].quantity).toBe(updatedOrderData.items[0].quantity);
  });

  test('should delete an order', async () => {
    const order = await Order.create({
      userModelId: 'testuserModel@example.com',
      items: [
        { productId: '12345', quantity: 1 },
      ],
      total: 20.0,
    });

    const response = await request(app)
      .delete(`/api/orders/${order._id}`) // Adjust the path as necessary
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204); // No content on successful delete

    const deletedOrder = await Order.findById(order._id);
    expect(deletedOrder).toBeNull();
  });

  test('should not create an order without authentication', async () => {
    const orderData = {
      items: [
        { productId: '12345', quantity: 2 },
      ],
      total: 50.0,
    };

    const response = await request(app)
      .post('/api/orders') // Adjust the path as necessary
      .send(orderData);

    expect(response.status).toBe(401); // Unauthorized
  });
});
