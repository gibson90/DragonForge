// src/database/connection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger'); // Ensure you have a logger setup

dotenv.config();

const connectDB = async () => {
  const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/mtg-online";
  try {
    console.log("DB_URI from .env:", DB_URI);
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });    
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
