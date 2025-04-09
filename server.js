// This step is for loading environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// This step is for importing route modules
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const { setApp } = require('./api'); // This step is for loading internal auth API (register, login, etc.)

const app = express();
const PORT = process.env.PORT || 5000;

// This step is for setting up middleware
app.use(bodyParser.json()); // This step is for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // This step is for parsing application/x-www-form-urlencoded
app.use(cors()); // This step is for enabling CORS for all requests

// This step is for connecting to MongoDB using both MongoClient and Mongoose
MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(async (client) => {
    console.log('✅ MongoClient connected');

    // This step is for connecting Mongoose to the same MongoDB cluster
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Mongoose connected');

    // This step is for setting internal authentication routes from api.js
    setApp(app, client);

    // This step is for defining workout and exercise API routes
    app.use('/api/exercises', exerciseRoutes);
    app.use('/api/workouts', workoutRoutes);

    // This step is for handling undefined routes
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found!' });
    });

    // This step is for starting the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // This step is for handling MongoDB connection errors
    console.error('❌ Failed to connect to MongoDB:', err);
  });

// This step is for handling unexpected server errors
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});
