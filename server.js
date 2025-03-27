require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { setApp } = require('./api'); // Import the setApp function from api.js

// Importing the routes
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
MongoClient.connect(process.env.MONGODB_URI)
  .then(client => {
    // Initialize API routes
    setApp(app, client);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => console.error(error));

// Define routes
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
