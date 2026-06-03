const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  name: String,
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  picture: String,
  passwordHash: {
    type: String,
    select: false,
  },
  authProvider: {
    type: String,
    enum: ['google', 'local'],
    default: 'google',
  },
});

module.exports = mongoose.model('User', UserSchema);
