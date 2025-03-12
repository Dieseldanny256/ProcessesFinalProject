const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId : {type: Number, required: true},
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  friends: {type: Array},
  friendRequests: {type: Array},
  friendRequestsSent: {type: Array},
  profile: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}

});

const profileSchema = new mongoose.Schema({
  userId : {type: Number, required: true},
  displayName: {type: String, required: true},
  streak: {type: Number, default: 0},
  powerlevel: {type: Number, default: 0},
  stats: {type: Array},
  profilePicture: {type: Number, default: 0}
})

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Profile', profileSchema);