const mongoose = require('mongoose');

// This step is for defining the User schema
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  friends: { type: [Number], default: [] },
  friendRequests: { type: [Number], default: [] },
  friendRequestsSent: { type: [Number], default: [] },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
}, { collection: 'Users' });

// This step is for defining the Profile schema
const profileSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true },
  streak: { type: Number, default: 0 },
  powerlevel: { type: Number, default: 0 },
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  profilePicture: { type: Number, default: 0 }
}, { collection: 'Profiles' });

// This step is for exporting the User and Profile models
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { User, Profile };
