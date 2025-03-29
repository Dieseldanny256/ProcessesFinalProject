require('dotenv').config();
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { User, Profile } = require('./models/User'); // Ensure this path is correct

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.setApp = function (app, client) {

    app.post('/api/register', async (req, res, next) => {
        // incoming: login, password, displayName, email
        // outgoing: error, userId

        const { login, password, displayName, email } = req.body;

        var error = '';
        var userId = null;

        try {
            const db = client.db();
            const usersCollection = db.collection('Users');
            const profilesCollection = db.collection('Profiles');

            // Check if login already exists
            const existingUser = await usersCollection.findOne({ login: login });
            if (existingUser) {
                error = 'Login already exists';
                return res.status(400).json({ error: error });
            }

            const verificationCode = crypto.randomBytes(8).toString('hex');
            userId = Date.now(); // Generate a unique userId

            // Create a new Profile
            const newProfile = {
                userId,
                displayName,
                streak: 0,
                powerlevel: 0,
                stats: [0, 0, 0, 0, 0], // Initialize stats as an array of numbers
                profilePicture: 0
            };

            const profileResult = await profilesCollection.insertOne(newProfile);

            // Create a new User and link the Profile
            const newUser = {
                userId,
                login,
                password,
                displayName,
                email,
                verificationCode,
                friends: [],
                friendRequests: [],
                friendRequestsSent: [],
                profile: profileResult.insertedId
            };

            await usersCollection.insertOne(newUser);

            const msg = {
                to: email,
                from: 'ch121219@ucf.edu',
                subject: 'Email Verification',
                text: `Your verification code is: ${verificationCode}`,
                html: `<strong>Your verification code is: ${verificationCode}</strong>`,
            };

            await sgMail.send(msg);

            
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error, userId: userId };
        res.status(200).json(ret);
    });

    app.post('/api/verifyEmail', async (req, res, next) => {
        // incoming: userId, verificationCode
        // outgoing: userDetails, error

        const { userId, verificationCode } = req.body;

        var error = '';
        var userDetails = null;

        try {
            const db = client.db();
            const usersCollection = db.collection('Users');
            const user = await usersCollection.findOne({ userId: userId });

            if (user && user.verificationCode == verificationCode) {
                user.isVerified = true;
                user.verificationCode = null;
                await usersCollection.updateOne({ userId: userId }, { $set: user });

                userDetails = {
                    userId: user.userId,
                    login: user.login,
                    displayName: user.displayName,
                    email: user.email,
                    isVerified: user.isVerified,
                    friends: user.friends,
                    friendRequests: user.friendRequests,
                    friendRequestsSent: user.friendRequestsSent,
                    profile: user.profile
                };
            } else {
                error = 'Invalid verification code';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { userDetails: userDetails, error: error };
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: user details, error

        const { login, password } = req.body;

        var error = '';
        var userDetails = null;

        try {
            const db = client.db();
            const usersCollection = db.collection('Users');
            const user = await usersCollection.findOne({ login: login, password: password });

            if (user) {
                userDetails = {
                    userId: user.userId,
                    login: user.login,
                    displayName: user.displayName,
                    email: user.email,
                    isVerified: user.isVerified,
                    friends: user.friends,
                    friendRequests: user.friendRequests,
                    friendRequestsSent: user.friendRequestsSent,
                    profile: user.profile
                };
            } else {
                error = 'Invalid login or password';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { userDetails: userDetails, error: error };
        res.status(200).json(ret);
    });
    
    app.post('/api/getProfile', async (req, res, next) => {
        // incoming: userId
        // outgoing: profile, error
    
        const { userId } = req.body;
    
        var error = '';
        var profile = null;
    
        try {
            const db = client.db();
            const profilesCollection = db.collection('Profiles');
    
            // Find the profile by userId
            profile = await profilesCollection.findOne({ userId: userId });
    
            if (!profile) {
                error = 'Profile not found';
            }
        } catch (e) {
            error = e.toString();
        }
    
        var ret = { profile: profile, error: error };
        res.status(200).json(ret);
    });

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
                const friendsProfiles = await db.collection('Profiles').find({ userId: { $in: user.friends } }).toArray();
                friendResults = friendsProfiles.map(profile => ({
                    userId: profile.userId,
                    displayName: profile.displayName,
                    streak: profile.streak,
                    powerlevel: profile.powerlevel,
                    stats: profile.stats,
                    profilePicture: profile.profilePicture
                }));
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

    app.post('/api/getTopPowerlevels', async (req, res, next) => {
        // incoming: none
        // outgoing: topProfiles [], error

        var error = '';
        var topProfiles = [];

        try {
            const db = client.db();
            const profilesCollection = db.collection('Profiles');

            // Fetch top 10 profiles sorted by powerlevel in descending order
            topProfiles = await profilesCollection
                .find({})
                .sort({ powerlevel: -1 })
                .limit(10)
                .toArray();

            topProfiles = topProfiles.map(profile => ({
                userId: profile.userId,
                displayName: profile.displayName,
                streak: profile.streak,
                powerlevel: profile.powerlevel,
                stats: profile.stats,
                profilePicture: profile.profilePicture
            }));
        } catch (e) {
            error = e.toString();
        }

        var ret = { topProfiles: topProfiles, error: error };
        res.status(200).json(ret);
    });
}
