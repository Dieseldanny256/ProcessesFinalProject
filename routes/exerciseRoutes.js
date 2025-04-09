const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// This step is for defining a list of common gym exercises
const exercises = [
    { name: 'Bench Press', category: 'chest' },
    { name: 'Squat', category: 'leg' },
    { name: 'Bicep Curl', category: 'arm' },
    { name: 'Deadlift', category: 'back' },
    { name: 'Running', category: 'stamina' },
    { name: 'Plank', category: 'core' }
];

// This step is for seeding the database with default exercises
router.get('/seed', async (req, res) => {
    try {
        // This step is for checking if data already exists to avoid duplication
        const existingExercises = await Exercise.find();
        if (existingExercises.length > 0) {
            return res.status(200).json({ message: 'Exercises already exist. No changes made.' });
        }

        // This step is for adding exercise data if it does not already exist
        await Exercise.insertMany(exercises);
        res.status(201).json({ message: 'Exercises added successfully!' });
    } catch (error) {
        console.error('Error seeding exercises:', error);
        res.status(500).json({ error: 'Failed to seed exercises' });
    }
});

// This step is for retrieving all exercises
router.get('/', async (req, res) => {
    try {
        const allExercises = await Exercise.find();
        res.status(200).json(allExercises);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

// This step is for retrieving exercises by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const exercisesByCategory = await Exercise.find({ category: category.toLowerCase() });

        if (exercisesByCategory.length === 0) {
            return res.status(404).json({ message: `No exercises found for category: ${category}` });
        }

        res.status(200).json(exercisesByCategory);
    } catch (error) {
        console.error('Error fetching exercises by category:', error);
        res.status(500).json({ error: 'Failed to retrieve exercises by category' });
    }
});

// This step is for deleting all exercises (optional, for admin use)
router.delete('/delete', async (req, res) => {
    try {
        await Exercise.deleteMany({});
        res.status(200).json({ message: 'All exercises deleted successfully!' });
    } catch (error) {
        console.error('Error deleting exercises:', error);
        res.status(500).json({ error: 'Failed to delete exercises' });
    }
});

module.exports = router;
