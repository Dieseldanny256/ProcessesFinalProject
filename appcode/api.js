const express = require('express');
const router = express.Router();

exports.setApp = function (app, client) {

    app.post('/api/addFriend', async (req, res, next) => {
        // incoming: userId, friendUserId
        // outgoing: error

        const { userId, friendUserId } = req.body;

        var error = '';

        try {
            const db = client.db();
            const user = await db.collection('Users').findOne({ userId: userId });
            const friend = await db.collection('Users').findOne({ userId: friendUserId });

            if (user && friend) {
                await db.collection('Users').updateOne(
                    { userId: userId },
                    { $addToSet: { friends: friendUserId } }
                );
                await db.collection('Users').updateOne(
                    { userId: friendUserId },
                    { $addToSet: { friends: userId } }
                );
            } else {
                error = 'User or Friend not found';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/deleteFriend', async (req, res, next) => {
        // incoming: userId, friendUserId
        // outgoing: error

        const { userId, friendUserId } = req.body;

        var error = '';

        try {
            const db = client.db();
            await db.collection('Users').updateOne(
                { userId: userId },
                { $pull: { friends: friendUserId } }
            );
            await db.collection('Users').updateOne(
                { userId: friendUserId },
                { $pull: { friends: userId } }
            );
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/searchFriends', async (req, res, next) => {
        // incoming: userId
        // outgoing: friendResults [], error

        const { userId } = req.body;

        var error = '';
        var friendResults = [];

        try {
            const db = client.db();
            const user = await db.collection('Users').findOne({ userId: userId });

            if (user) {
                friendResults = await db.collection('Users').find({ userId: { $in: user.friends } }).toArray();
            } else {
                error = 'User not found';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { friendResults: friendResults, error: error };
        res.status(200).json(ret);
    });

    app.post('/api/sendFriendRequest', async (req, res, next) => {
        // incoming: userId, friendUserId
        // outgoing: error

        const { userId, friendUserId } = req.body;

        var error = '';

        try {
            const db = client.db();
            const user = await db.collection('Users').findOne({ userId: userId });
            const friend = await db.collection('Users').findOne({ userId: friendUserId });

            if (user && friend) {
                await db.collection('Users').updateOne(
                    { userId: friendUserId },
                    { $addToSet: { friendRequests: userId } }
                );
                await db.collection('Users').updateOne(
                    { userId: userId },
                    { $addToSet: { friendRequestsSent: friendUserId } }
                );
            } else {
                error = 'User or Friend not found';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });
}
