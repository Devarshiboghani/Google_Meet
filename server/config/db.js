const mongoose = require('mongoose');

const connectDB = async () => {
  // Setup proper connection events
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB connection failed:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error; // Rethrow to prevent server startup
  }
};

module.exports = connectDB;
