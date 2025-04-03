const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const moment = require('moment');

// This step is for calculating stats based on sets and reps
const updateStats = async (userId) => {
    const workouts = await Workout.find({ userId: new mongoose.Types.ObjectId(userId) }).populate('exercises.exerciseId');

    // This step is for resetting stats before calculating new values
    const stats = { chest: 0, leg: 0, arm: 0, back: 0, stamina: 0 };

    // This step is for iterating through all workouts and updating stats
    workouts.forEach(workout => {
        workout.exercises.forEach(ex => {
            if (ex.exerciseId && ex.exerciseId.category) {
                const category = ex.exerciseId.category;
                stats[category] += ex.sets * ex.reps;
            }
        });
    });

    return stats;
};

// This step is for logging a new workout and updating stats
router.post('/log', async (req, res) => {
    try {
        const { userId, date, exercises } = req.body;

        // This step is for validating and converting userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // This step is for checking if a workout already exists for the selected date
        let workout = await Workout.findOne({ userId: userObjectId, date });

        if (workout) {
            // This step is for updating the existing workout
            workout.exercises = exercises;
            await workout.save();
        } else {
            // This step is for creating a new workout if none exists
            workout = new Workout({
                userId: userObjectId,
                date,
                exercises
            });
            await workout.save();
        }

        // This step is for calculating updated stats after logging
        const updatedStats = await updateStats(userId);

        // This step is for calculating powerlevel as the sum of all updatedStats values
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        // This step is for returning updated stats and powerlevel
        res.status(201).json({
            message: 'Workout logged successfully!',
            updatedStats,
            powerlevel
        });
    } catch (error) {
        console.error('Error logging workout:', error);
        res.status(500).json({ error: 'Failed to log workout' });
    }
});

// This step is for editing workout for a specific day
router.put('/:userId/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const { exercises } = req.body;

        // This step is for validating and converting userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // This step is for finding and updating the workout
        const workout = await Workout.findOneAndUpdate(
            { userId: userObjectId, date },
            { exercises },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found for the specified date' });
        }

        // This step is for updating stats after modifying workout
        const updatedStats = await updateStats(userId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(200).json({ message: 'Workout updated successfully!', updatedStats, powerlevel });
    } catch (error) {
        console.error('Error updating workout:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});

// This step is for deleting a specific exercise from a workout
router.delete('/:userId/:date/:exerciseId', async (req, res) => {
    try {
        const { userId, date, exerciseId } = req.params;

        // This step is for validating and converting IDs to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(exerciseId)) {
            return res.status(400).json({ error: 'Invalid userId or exerciseId format' });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const exerciseObjectId = new mongoose.Types.ObjectId(exerciseId);

        // This step is for finding the workout and removing the exercise
        const workout = await Workout.findOneAndUpdate(
            { userId: userObjectId, date },
            { $pull: { exercises: { exerciseId: exerciseObjectId } } },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found or exercise not found' });
        }

        // This step is for updating stats after deleting exercise
        const updatedStats = await updateStats(userId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(200).json({ message: 'Exercise deleted successfully!', updatedStats, powerlevel });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
});

// This step is for getting workout history and calculating streak
router.get('/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;

        // This step is for validating and converting userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // This step is for retrieving all workouts for the user
        const workouts = await Workout.find({ userId: userObjectId });

        // This step is for calculating streak based on consecutive days
        let streak = 0;
        let previousDate = null;

        workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

        workouts.forEach(workout => {
            const currentDate = moment(workout.date).format('YYYY-MM-DD');
            if (previousDate) {
                const diff = moment(currentDate).diff(moment(previousDate), 'days');
                if (diff === 1) {
                    //consecutive
                    streak++;
                } else {
                    streak = 1;
                }
            } else {
                streak = 1;
            }
            previousDate = currentDate;
        });

        res.status(200).json({ streak, workouts });
    } catch (error) {
        console.error('Error retrieving workout history:', error);
        res.status(500).json({ error: 'Failed to retrieve workout history' });
    }
});

module.exports = router;
