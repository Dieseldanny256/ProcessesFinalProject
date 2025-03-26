const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true},
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  friends: { type: [Number], default: [] },
  friendRequests: { type: [Number], default: [] },
  friendRequestsSent: { type: [Number], default: [] },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }
});

const profileSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  displayName: { type: String, required: true },
  streak: { type: Number, default: 0 },
  powerlevel: { type: Number, default: 0 },
  stats: { type: [String], default: [] },
  profilePicture: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { User, Profile };
