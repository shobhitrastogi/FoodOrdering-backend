import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CON);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error)
  }
};

