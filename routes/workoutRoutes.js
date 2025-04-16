const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const moment = require('moment');
const { updateProfileStats } = require('../utils/updateProfileStats');

// This step is for calculating stats based on sets and reps
const updateStats = async (userId, date, increase = true) => {
    try {
        // This step is for finding workouts by numeric userId and populating exercises
        const workouts = await Workout.find({ userId: Number(userId), date }).populate('exercises.exerciseId');

        // This step is for resetting stats before calculating new values
        const stats = { chest: 0, leg: 0, arm: 0, back: 0, stamina: 0, core: 0 };

        // This step is for iterating through all workouts and updating stats
        workouts.forEach(workout => {
            workout.exercises.forEach(ex => {
                if (ex.exerciseId && ex.exerciseId.category) {
                    const category = ex.exerciseId.category;
                    if (stats.hasOwnProperty(category)) {
                        stats[category] += ex.sets * ex.reps * (increase ? 1 : -1);
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
        // const updatedStats = await updateStats(numericUserId);
        // const powerlevel = Object.values(updatedStats).reduce((a, b) => a + b, 0);

        res.status(201).json({
            message: 'Workout logged successfully!'
        });
    } catch (error) {
        console.error("Error logging workout:", error.message);
        res.status(500).json({ error: 'Failed to log workout' });
    }
});

// This step is for editing workout for a specific day
router.put('/update/:userId/:date/:index', async (req, res) => {
    try {
        const { userId, date, index } = req.params;
        const { exercise } = req.body;

        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // This step is for finding the workout of the user on the specific date
        const workout = await Workout.findOne({ userId: numericUserId, date }).populate('exercises.exerciseId');
        console.log(workout);

        if (!workout) {
            return res.status(200).json({ error: 'Workout not found for the specified date' });
        }

        workout.exercises[index] = exercise;
        await workout.save();

        res.status(200).json({ message: 'Workout updated successfully!' });
    } catch (error) {
        console.error("Error updating workout:", error.message);
        res.status(500).json({ error: 'Failed to update workout' });
    }
});

// This step is for deleting a specific exercise from a workout
router.delete('/:userId/:date/:index', async (req, res) => {
    try {
        const { userId, date, index } = req.params;

        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // This step is for finding the workout of the user on the specific date
        const workout = await Workout.findOne({ userId: numericUserId, date }).populate('exercises.exerciseId');
        console.log(workout);

        if (!workout) {
            return res.status(200).json({ error: 'Workout not found for the specified date' });
        }

        workout.exercises.splice(index, 1);
        await workout.save();

        res.status(200).json({ message: 'Exercise deleted successfully!' });
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

        const workouts = await Workout.find({ userId: numericUserId, checkedOff: true });

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

        const updatedStats = await updateStats(numericUserId, date, workout.checkedOff);
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

// This step is for retrieving all exercises of a user on a specific date
router.get('/:userId/:date/exercises', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const numericUserId = Number(userId);

        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // This step is for finding the workout of the user on the specific date
        const workout = await Workout.findOne({ userId: numericUserId, date }).populate('exercises.exerciseId');

        if (!workout) {
            return res.status(200).json({ error: 'Workout not found for the specified date' });
        }

        // This step is for returning only exercises array
        res.status(200).json({
            exercises: workout.exercises
        });

    } catch (error) {
        console.error('Error fetching exercises for user on date:', error.message);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

// This step is for adding a new exercise, creating a new workout if that 
router.put('/add/:userId/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const { exercises } = req.body;
        const numericUserId = Number(userId);
        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        // This step is for checking if workout already exists
        let workout = await Workout.findOne({ userId: numericUserId, date });

        if (workout) {
            workout.exercises = workout.exercises.concat(exercises);
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

        res.status(201).json({
            message: 'Workout added successfully!'
        });
    } catch (error) {
        console.error("Error adding workout:", error.message);
        res.status(500).json({ error: 'Failed to add workout' });
    }
});

function getDateString(date)
{
  let string = date.getFullYear() + "-";
  let month = (date.getMonth() + 1).toString();
  if (month.length < 2) {month = "0" + month;}
  let day = (date.getDate()).toString();
  if (day.length < 2) {day = "0" + day;}
  string = string + month + "-" + day;

  return string;
}

// This step is for retrieving all exercises of a user in a week starting on the given date
router.get('/:userId/:date/weekExercises', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const numericUserId = Number(userId);

        if (!Number.isFinite(numericUserId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        let exercises = [];

        //Convert the date string into a date object
        let dateObj = new Date();
        let splitDate = date.split("-");
        splitDate[0] = parseInt(splitDate[0]);
        splitDate[1] = parseInt(splitDate[1]) - 1;
        splitDate[2] = parseInt(splitDate[2]);

        dateObj.setFullYear(splitDate[0], splitDate[1], splitDate[2]);

        // This step is for finding the workout of the user on the specific date
        for (let i = 0; i < 7; i++)
        {
            let dateString = getDateString(dateObj);
            const workout = await Workout.findOne({ userId: numericUserId, date: dateString }).populate('exercises.exerciseId');
            
            if (!workout) {
                exercises.push({exercises: [], isChecked: false});
                dateObj.setDate(dateObj.getDate() + 1);
                continue;
            }

            exercises.push({exercises: workout.exercises, isChecked: workout.checkedOff});
            dateObj.setDate(dateObj.getDate() + 1);
        }

        // This step is for returning only exercises array
        res.status(200).json({
            exercises: exercises
        });

    } catch (error) {
        console.error('Error fetching exercises for user starting on date:', error.message);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

module.exports = router;
