const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const moment = require('moment');
const { updateProfileStats } = require('../utils/updateProfileStats');

// This step is for calculating stats based on sets and reps
const updateStats = async (userId) => {
    try {
        // This step is for finding workouts by numeric userId and populating exercises
        const workouts = await Workout.find({ userId: Number(userId) }).populate('exercises.exerciseId');

        // This step is for resetting stats before calculating new values
        const stats = { chest: 0, leg: 0, arm: 0, back: 0, stamina: 0, core: 0 };

        // This step is for iterating through all workouts and updating stats
        workouts.forEach(workout => {
            workout.exercises.forEach(ex => {
                if (ex.exerciseId && ex.exerciseId.category) {
                    const category = ex.exerciseId.category;
                    if (stats.hasOwnProperty(category)) {
                        stats[category] += ex.sets * ex.reps;
                    }
                }
            });
        });

        return stats;
    } catch (err) {
        console.error("Error in updateStats:", err.message);
        return { chest: 0, leg: 0, arm: 0, back: 0, stamina: 0, core: 0 };
    }
};

// This step is for logging a new workout and updating stats
router.post('/log', async (req, res) => {
    try {
        const { userId, date, exercises } = req.body;
        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // This step is for checking if workout already exists
        let workout = await Workout.findOne({ userId: numericUserId, date });

        if (workout) {
            workout.exercises = exercises;
            await workout.save();
        } else {
            workout = new Workout({
                userId: numericUserId,
                date,
                exercises,
                checkedOff: false
            });
            await workout.save();
        }

        // This step is for calculating updated stats
        const updatedStats = await updateStats(numericUserId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(201).json({
            message: 'Workout logged successfully!',
            updatedStats,
            powerlevel
        });
    } catch (error) {
        console.error("Error logging workout:", error.message);
        res.status(500).json({ error: 'Failed to log workout' });
    }
});

// This step is for editing workout for a specific day
router.put('/:userId/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const { exercises } = req.body;

        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        const workout = await Workout.findOneAndUpdate(
            { userId: numericUserId, date },
            { exercises },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found for the specified date' });
        }

        const updatedStats = await updateStats(numericUserId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(200).json({ message: 'Workout updated successfully!', updatedStats, powerlevel });
    } catch (error) {
        console.error("Error updating workout:", error.message);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});

// This step is for deleting a specific exercise from a workout
router.delete('/:userId/:date/:exerciseId', async (req, res) => {
    try {
        const { userId, date, exerciseId } = req.params;

        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        const workout = await Workout.findOneAndUpdate(
            { userId: numericUserId, date },
            { $pull: { exercises: { exerciseId } } },
            { new: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found or exercise not found' });
        }

        const updatedStats = await updateStats(numericUserId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(200).json({ message: 'Exercise deleted successfully!', updatedStats, powerlevel });
    } catch (error) {
        console.error("Error deleting exercise:", error.message);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
});

// This step is for getting workout history and calculating streak
router.get('/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;
        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        const workouts = await Workout.find({ userId: numericUserId });

        let streak = 0;
        let previousDate = null;

        workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

        workouts.forEach(workout => {
            const currentDate = moment(workout.date).format('YYYY-MM-DD');
            if (previousDate) {
                const diff = moment(currentDate).diff(moment(previousDate), 'days');
                streak = (diff === 1) ? streak + 1 : 1;
            } else {
                streak = 1;
            }
            previousDate = currentDate;
        });

        res.status(200).json({ streak, workouts });
    } catch (error) {
        console.error("Error retrieving workout history:", error.message);
        res.status(500).json({ error: 'Failed to retrieve workout history' });
    }
});

// This step is for toggling workout checkoff and updating stats
router.post('/:userId/:date/checkoff', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        const workout = await Workout.findOne({ userId: numericUserId, date });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found for the specified date' });
        }

        workout.checkedOff = !workout.checkedOff;
        await workout.save();

        const updatedStats = await updateStats(numericUserId);
        const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        const statsArray = [
            updatedStats.chest,
            updatedStats.leg,
            updatedStats.arm,
            updatedStats.back,
            updatedStats.stamina,
            updatedStats.core
        ];

        const streak = 0;
        await updateProfileStats(numericUserId, streak, powerlevel, statsArray);

        const message = workout.checkedOff
            ? 'Workout checked off and points added!'
            : 'Workout unchecked and points deducted!';

        res.status(200).json({
            message,
            checkedOff: workout.checkedOff,
            updatedStats,
            powerlevel
        });
    } catch (error) {
        console.error("Error toggling checkoff:", error.message);
        res.status(500).json({ error: 'Failed to toggle checkoff' });
    }
});

module.exports = router;
