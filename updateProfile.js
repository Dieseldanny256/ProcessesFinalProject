const { MongoClient } = require('mongodb');

async function updateProfileStats(client, userId, streak, powerlevel, stats) {
    // stats is expected to be an array of 6 numbers
    if (stats.length !== 6) {
        throw new Error('Stats array must contain exactly 6 values');
    }

    try {
        const db = client.db();
        const profilesCollection = db.collection('Profiles');

        // Find the profile by userId
        const profile = await profilesCollection.findOne({ userId: userId });
        if (!profile) {
            throw new Error('Profile not found');
        }

        // Update the profile's stats, powerlevel, and streak
        const updatedStats = profile.stats.map((value, index) => value + stats[index]);
        const updatedPowerlevel = profile.powerlevel + powerlevel;
        const updatedStreak = streak;

        await profilesCollection.updateOne(
            { userId: userId },
            {
                $set: {
                    stats: updatedStats,
                    powerlevel: updatedPowerlevel,
                    streak: updatedStreak
                }
            }
        );

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { updateProfileStats };
