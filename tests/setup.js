// Import necessary modules
import mongoose from 'mongoose';
import { connectDB } from '../config/db';

beforeAll(async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
  await connectDB(); // Connect to the database
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection
  console.log.mockRestore(); // Restore console.log
});
