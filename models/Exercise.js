const mongoose = require('mongoose');

// This step is for defining the schema for Exercise
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }
});

// This step is for exporting the Exercise model
module.exports = mongoose.model('Exercise', exerciseSchema);
