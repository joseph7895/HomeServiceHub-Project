import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local-service-marketplace';
    console.log(`Connecting to database at ${mongoUri} with a 2-second timeout...`);
    // Connect with a 2s server selection timeout so it doesn't hang if Mongo isn't running
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected. Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.warn(`Could not drop database (Local MongoDB might not be running): ${error.message}`);
    console.log('Proceeding assuming MongoDB Memory Server will be used.');
    process.exit(0);
  }
};

dropDB();
