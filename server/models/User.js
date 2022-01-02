const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  picture: String,
  password: String,
});

module.exports = mongoose.model('User', UserSchema);
