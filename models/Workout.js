const mongoose = require('mongoose');

// This step is for defining the schema for each exercise in the workout
const workoutExerciseSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true }
});

// This step is for defining the schema for Workout
const workoutSchema = new mongoose.Schema({
  // This step is for storing userId as a Number to match Profile.userId
  userId: { type: Number, required: true },

  date: { type: String, required: true },
  exercises: [workoutExerciseSchema],

  // This step is for tracking if workout is checked off
  checkedOff: { type: Boolean, default: false }
});

// This step is for exporting the Workout model
module.exports = mongoose.model('Workout', workoutSchema);
