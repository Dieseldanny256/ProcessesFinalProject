require('dotenv').config();
const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
            
            // Check if display name already exists
            const existingDisplayName = await profilesCollection.findOne({ displayName: displayName });
            if (existingDisplayName) {
                error = 'Display name already exists';
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
                stats: [0, 0, 0, 0, 0, 0], // Initialize stats as an array of numbers
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
            userDetails = newUser;

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

        var ret = { error: error, userDetails: userDetails };
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
            } else {
                error = 'Invalid verification code';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
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
    
    app.post('/api/sendResetLink', async (req, res, next) => {
        // incoming: login, email
        // outgoing: error, userId

        try {
            const { email, login, path } = req.body;

            var error = '';
            var message = '';

            const user = await User.findOne({email:email, login:login});

            if (!user) {
                res.status(200).json({ error: 'User not found!' });
                return;
            }

            const token = jwt.sign({id: user.userId}, "jwt_secret_key", {expiresIn: "1d"});

            const msg = {
                to: email,
                from: 'ch121219@ucf.edu',
                subject: 'Forgot Password',
                text: `Click on the link to finish resetting your password!:\n
                    ${path}reset-password/${user.userId}/${token}`
            };

            await sgMail.send(msg);
            message = 'Password reset link successfully sent!';
            
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error, message: message};
        res.status(200).json(ret);
    });

    app.post('/api/resetPassword/:userId/:token', async (req, res, next) => {
        // incoming: login, email
        // outgoing: error, userId

        try {
            const { userId, token} = req.params;
            const { password } = req.body;

            var error = '';
            var message = '';

            jwt.verify(token, "jwt_secret_key", (err, decoded) => {
                if(err) {
                    return res.json({error: "Token not found!"})
                } 
            })

            const user = await User.findOne({ userId: userId });

            if (!user) {
                res.status(200).json({ error: 'User not found!' });
                return;
            }
            
            user.password = password;
            await user.save();

            message = 'Password successfully reset!';
            
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error, message: message};
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

    app.post('/api/searchRequests', async (req, res, next) => {
        // incoming: userId
        // outgoing: friendResults [], error

        const { userId } = req.body;

        var error = '';
        var requestResults = [];

        try {
            const db = client.db();
            const user = await db.collection('Users').findOne({ userId: userId });

            if (user) {
                const friendsProfiles = await db.collection('Profiles').find({ userId: { $in: user.friendRequests } }).toArray();
                requestResults = friendsProfiles.map(profile => ({
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

        var ret = { requestResults: requestResults, error: error };
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

    app.post('/api/denyFriendRequest', async (req, res, next) => {
        // incoming: receivingUserId, sendingUserId
        // outgoing: error

        const { receivingUserId, sendingUserId } = req.body;

        var error = '';

        try {
            const db = client.db();
            const usersCollection = db.collection('Users');

            // Remove the sendingUserId from the receiving user's friendRequests array
            await usersCollection.updateOne(
                { userId: receivingUserId },
                { $pull: { friendRequests: sendingUserId } }
            );

            // Remove the receivingUserId from the sending user's friendRequestsSent array
            await usersCollection.updateOne(
                { userId: sendingUserId },
                { $pull: { friendRequestsSent: receivingUserId } }
            );
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/getTopPowerlevels', async (req, res, next) => {
        // incoming: userId, page
        // outgoing: topProfiles [], userRank, error

        const { userId, page } = req.body;

        var error = '';
        var topProfiles = [];
        var userRank = null;

        try {
            const db = client.db();
            const profilesCollection = db.collection('Profiles');

            // Calculate the skip value based on the page number
            const skip = (page - 1) * 10;

            // Fetch the requested set of 10 profiles sorted by powerlevel in descending order
            topProfiles = await profilesCollection
                .find({})
                .sort({ powerlevel: -1 })
                .skip(skip)
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

            // Find the rank of the given userId
            const allProfiles = await profilesCollection
                .find({})
                .sort({ powerlevel: -1 })
                .toArray();

            userRank = allProfiles.findIndex(profile => profile.userId === userId) + 1;
        } catch (e) {
            error = e.toString();
        }

        var ret = { topProfiles: topProfiles, userRank: userRank, error: error };
        res.status(200).json(ret);
    });

    app.post('/api/getTopFriendPowerLevels', async (req, res, next) => {
        // incoming: userId, page
        // outgoing: topProfiles [], userRank, error

        const { userId, page } = req.body;

        var error = '';
        var topProfiles = [];
        var userRank = null;

        try {
            const db = client.db();
            const usersCollection = db.collection('Users');
            const profilesCollection = db.collection('Profiles');

            // Find the user to get their friends list
            const user = await usersCollection.findOne({ userId: userId });
            if (!user) {
                error = 'User not found';
                return res.status(400).json({ error: error });
            }

            const friendsList = user.friends || [];
            // Include the user itself in the friends list
            const friendsAndSelf = [...friendsList, userId];

            // Calculate the skip value based on the page number
            const skip = (page - 1) * 10;

            // Fetch the requested set of 10 profiles of friends (including the user) sorted by powerlevel in descending order
            topProfiles = await profilesCollection
                .find({ userId: { $in: friendsAndSelf } })
                .sort({ powerlevel: -1 })
                .skip(skip)
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

            // Find the rank of the given userId among friends (including the user)
            const allFriendProfiles = await profilesCollection
                .find({ userId: { $in: friendsAndSelf } })
                .sort({ powerlevel: -1 })
                .toArray();

            userRank = allFriendProfiles.findIndex(profile => profile.userId === userId) + 1;
        } catch (e) {
            error = e.toString();
        }

        var ret = { topProfiles: topProfiles, userRank: userRank, error: error };
        res.status(200).json(ret);
    });

    app.post('/api/searchProfiles', async (req, res, next) => {
        // incoming: searchText
        // outgoing: matchingProfiles [], error

        const { searchText } = req.body;

        var error = '';
        var matchingProfiles = [];

        try {
            const db = client.db();
            const profilesCollection = db.collection('Profiles');

            // Search for profiles with display names that match or partially match the searchText
            matchingProfiles = await profilesCollection
                .find({ displayName: { $regex: searchText, $options: 'i' } }) // Case-insensitive search
                .toArray();

            matchingProfiles = matchingProfiles.map(profile => ({
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

        var ret = { matchingProfiles: matchingProfiles, error: error };
        res.status(200).json(ret);
    });
    
    app.post('/api/updateProfilePicture', async (req, res, next) => {
        // incoming: userId, profilePicture
        // outgoing: error

        const { userId, profilePicture } = req.body;

        var error = '';

        try {
            const db = client.db();
            const profilesCollection = db.collection('Profiles');

            // Update the profilePicture value for the given userId
            const result = await profilesCollection.updateOne(
                { userId: userId },
                { $set: { profilePicture: profilePicture } }
            );

            if (result.matchedCount === 0) {
                error = 'Profile not found';
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });    

    app.post('/api/checkOffWorkout', async (req, res, next) => {
        // incoming: userId, date
        // outgoing: error

        const { userId, date } = req.body;

        var error = '';

        try {
            const db = client.db();
            const workoutsCollection = db.collection('workouts');
            const exercisesCollection = db.collection('exercises');

            // Find the workout by userId and date
            const workout = await workoutsCollection.findOne({ userId: userId, date: date });

            if (!workout) {
                error = 'Workout not found';
                return res.status(400).json({ error: error });
            }

            // Mark the workout as checked off
            await workoutsCollection.updateOne(
                { userId: userId, date: date },
                { $set: { checkedOff: !workout.checkedOff } }
            );

            // Calculate stats and powerlevel updates
            const stats = [0, 0, 0, 0, 0, 0]; // chest, back, leg, stamina, core, arm
            let totalReps = 0;

            for (const exercise of workout.exercises) {
                const { sets, reps, exerciseId } = exercise;
                const total = sets * reps;
                totalReps += total;

                // Fetch the exercise category
                const exerciseData = await exercisesCollection.findOne({ _id: exerciseId });
                if (exerciseData) {
                    const category = exerciseData.category.toLowerCase();
                    switch (category) {
                        case 'chest':
                            stats[0] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        case 'back':
                            stats[1] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        case 'leg':
                            stats[2] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        case 'stamina':
                            stats[3] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        case 'core':
                            stats[4] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        case 'arm':
                            stats[5] += total * (workout.checkedOff ? 1 : -1);
                            break;
                        default:
                            break;
                    }
                }
            }

            // Update the user's profile
            const result = await updateProfileStats(client, userId, workout.checkedOff, totalReps, stats);

            if (!result.success) {
                error = result.message;
                return res.status(400).json({ error: error });
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/findCheck', async (req, res, next) => {
        // incoming: userId, date
        // outgoing: isCheckedOff (boolean), error

        const { userId, date } = req.body;

        var error = '';
        var isCheckedOff = false;

        try {
            const db = client.db();
            const workoutsCollection = db.collection('workouts');

            // Find the workout by userId and date
            const workout = await workoutsCollection.findOne({ userId: userId, date: date });

            if (!workout) {
                error = 'Workout not found';
            } else {
                isCheckedOff = workout.checkedOff || false;
            }
        } catch (e) {
            error = e.toString();
        }

        var ret = { isCheckedOff: isCheckedOff, error: error };
        res.status(200).json(ret);
    });

}
