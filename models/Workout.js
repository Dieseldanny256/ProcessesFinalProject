const mongoose = require('mongoose');

// This step is for defining the schema for each exercise in the workout
const workoutExerciseSchema = new mongoose.Schema({
  exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true }
});

// This step is for defining the schema for Workout
const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: String, required: true },
  exercises: [workoutExerciseSchema]
});

// This step is for exporting the Workout model
module.exports = mongoose.model('Workout', workoutSchema);
