import mongoose from 'mongoose';
import { seedDatabase } from '../utils/seeder.js';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Check if we should fall back to mongodb-memory-server in development
    if (process.env.NODE_ENV !== 'production' && (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1'))) {
      try {
        console.log('Testing local MongoDB connection...');
        // Set a small connection timeout (2 seconds) to fail quickly if no local MongoDB is running
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Successfully connected to local MongoDB.');
      } catch (connectionError) {
        console.warn('Local MongoDB is not running. Starting in-memory MongoDB server as fallback...');
        await mongoose.disconnect();
        
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        
        console.log(`In-memory MongoDB server started at: ${mongoUri}`);
        await mongoose.connect(mongoUri);
      }
    } else {
      await mongoose.connect(mongoUri);
    }

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    
    // Auto-seed if database is empty
    await seedDatabase();
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
