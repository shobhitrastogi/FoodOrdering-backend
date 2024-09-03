import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

describe('User Controller', () => {
  beforeAll(async () => {
    // Connect to the database and clear the user collection
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    // Close the database connection after tests
    await mongoose.connection.close();
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User',
        email: 'testuser@mail.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);  // Status code for successful creation
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('User registered successfully.');
  });

  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User 1',
        email: 'testuser1@mail.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Test User 1',
        email: 'testuser1@mail.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(400);  // Status code for a bad request
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User already exists.');
  });

  it('should log in an existing user', async () => {
    // First, register the user
    await request(app)
      .post('/api/user/register')
      .send({
        name: 'Login Test User',
        email: 'logintestuser@mail.com',
        password: 'password123',
      });

    // Then, attempt to log in
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'logintestuser@mail.com',
        password: 'password123',
      });

    console.log(response.body);  // For debugging if needed
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty('token');
  });

  it('should return error for non-existing user login', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'nonexistinguser@mail.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(404);  // Status code for not found
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User doesn't exist.");
  });

  it('should return error for invalid password', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'logintestuser@mail.com',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);  // Status code for unauthorized access
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials.');
  });
});
