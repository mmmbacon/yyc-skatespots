/* eslint-disable no-console */
const { OAuth2Client } = require('google-auth-library');
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

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};

exports.findOrCreateUser = async (token) => {
  // Verify Auth Token
  const googleUser = await verifyAuthToken(token);
  // Check if the user exists with google info
  const user = await checkIfUserExists(googleUser.email);
  // If User exists, return them, otherwise create new user in db
  return user || createNewUser(googleUser);
};
