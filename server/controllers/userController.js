/* eslint-disable no-console */
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;
const User = require('../models/User');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const verifyAuthToken = async (token) => {
  let result;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    result = ticket.getPayload();
  } catch (err) {
    console.error('Error verifying AuthToken', err);
  }

  return result;
};

const checkIfUserExists = async (email) => User.findOne({ email }).exec();
const comparePassword = async (email, plaintextPassword) => {
  // Find user and get passwordDigest
  const user = await User.findOne({ email }).exec();

  // Load hash from db
  bcrypt.compare(plaintextPassword, user.password, (err, result) => {
    if (!err) {
      return result;
    }
    return err;
  });
};
const generatePassword = async (plaintextPassword) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plaintextPassword, salt, (err, hash) => {
      if (!err) {
        return hash;
      }
      return err;
    });
  });
};

const createNewGoogleUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};

const createNewUser = (email, password, username) => {
  const user = { email, password, username };
  return new User(user).save();
};

exports.findOrCreateGoogleUser = async (token) => {
  // Verify Auth Token
  const googleUser = await verifyAuthToken(token);
  // Check if the user exists with google info
  const user = await checkIfUserExists(googleUser.email);
  // If User exists, return them, otherwise create new user in db
  return user || createNewGoogleUser(googleUser);
};

exports.findBasicUser = async (email, password) => {
  // Check if the user exists with email
  const user = await checkIfUserExists(email);
  let authUser = null;

  if (user) {
    // Load hash from your password DB.
    bcrypt.compare(password, user.password, (err, result) => {
      // result == true
      if (err) {
        console.error(err);
      }

      if (result) {
        authUser = user;
      }
    });
  }
  // If User exists, return them, otherwise create new user in db
  return authUser;
};

exports.createBasicUser = async (email, password, username) => {
  // Check if the user exists with email
  const user = await checkIfUserExists(email);

  if (!user) {
    return createNewUser(email, password, username);
  }
};
