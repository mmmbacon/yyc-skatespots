const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  //Verify Auth Token
  const googleUser = await verifyAuthToken(token);
  //Check if the user exists with google info
  const user = await checkIfUserExists(googleUser.email);
  //If User exists, return them, otherwise create new user in db
  return user ? user : createNewUser(googleUser);
}

const verifyAuthToken = async token => {
  try{
    const ticket = await client.verifyIdToken({
      idToken: token, 
      audience: process.env.OAUTH_CLIENT_ID
    })
    return ticket.getPayload();
  }catch(err){
    console.error("Error verifying AuthToken", err);
  }
}

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
}