import request from 'supertest';
import app from '../app.js';

describe('App', () => {
  it('should respond with API Working on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('API Working');
  });
});
