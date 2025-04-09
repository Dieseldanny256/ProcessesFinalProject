const mongoose = require('mongoose');
const { Profile } = require('../models/User');

// This step is for updating profile stats using userId (number type)
async function updateProfileStats(userId, streak, powerlevelToAdd, statsToAdd) {
    if (!Array.isArray(statsToAdd) || statsToAdd.length !== 6) {
        return { success: false, message: 'Stats array must contain exactly 6 numbers.' };
    }

    try {
        // This step is for finding the profile based on userId (number)
        const numericUserId = Number(userId);
        const profile = await Profile.findOne({ userId: numericUserId });

        if (!profile) {
            console.error(`❗ Profile not found for userId: ${numericUserId}`);
            return { success: false, message: 'Profile not found.' };
        }

        // This step is for computing new stats and updating fields
        const currentStats = profile.stats.map(Number);
        const updatedStats = currentStats.map((val, idx) => val + statsToAdd[idx]);

        profile.stats = updatedStats;
        profile.powerlevel += powerlevelToAdd;
        profile.streak = streak;

        await profile.save();

        console.log(`✅ Updated profile for userId: ${numericUserId}`);
        return { success: true, message: 'Profile updated successfully.' };
    } catch (error) {
        console.error('🔥 Error in updateProfileStats:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { updateProfileStats };
