/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-in-production';
const JWT_EXPIRES_IN = '7d';
const DEFAULT_AVATAR = '/default_image.png';
const BCRYPT_ROUNDS = 10;

const normalizeUsername = (username) => username.trim().toLowerCase();

const isValidUsername = (username) => /^[a-z0-9_]{3,30}$/.test(username);

exports.toPublicUser = (user) => {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : user;
  const displayName = doc.username || doc.name;
  return {
    _id: doc._id,
    username: doc.username,
    name: displayName,
    email: doc.email,
    picture: doc.picture || DEFAULT_AVATAR,
  };
};

const toPublicUser = exports.toPublicUser;

const createToken = (userId) =>
  jwt.sign({ userId: String(userId) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const authPayload = (user) => ({
  token: createToken(user._id),
  user: toPublicUser(user),
});

const verifyGoogleToken = async (token) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Error verifying Google token', err);
    return null;
  }
};

const findOrCreateGoogleUser = async (googleUser) => {
  const email = googleUser.email?.toLowerCase();
  let user = await User.findOne({ email }).exec();

  if (user) {
    if (!user.picture && googleUser.picture) {
      user.picture = googleUser.picture;
      await user.save();
    }
    return user;
  }

  return new User({
    name: googleUser.name,
    email,
    picture: googleUser.picture,
    authProvider: 'google',
  }).save();
};

const verifyAppToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.userId) return null;
    return User.findById(payload.userId).exec();
  } catch {
    return null;
  }
};

exports.authenticateFromToken = async (authHeader) => {
  if (!authHeader) return null;

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

  const appUser = await verifyAppToken(token);
  if (appUser) return appUser;

  const googleUser = await verifyGoogleToken(token);
  if (!googleUser) return null;

  return findOrCreateGoogleUser(googleUser);
};

/** @deprecated use authenticateFromToken */
exports.findOrCreateUser = exports.authenticateFromToken;

exports.signUp = async ({ username, email, password }) => {
  const normalizedUsername = normalizeUsername(username);
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedUsername || !normalizedEmail || !password) {
    throw new GraphQLError('Username, email, and password are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (!isValidUsername(normalizedUsername)) {
    throw new GraphQLError(
      'Username must be 3–30 characters: letters, numbers, underscores',
      { extensions: { code: 'BAD_USER_INPUT' } },
    );
  }

  if (password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email: normalizedEmail }).exec(),
    User.findOne({ username: normalizedUsername }).exec(),
  ]);

  if (existingEmail) {
    throw new GraphQLError('An account with this email already exists', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (existingUsername) {
    throw new GraphQLError('This username is already taken', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await new User({
    username: normalizedUsername,
    name: normalizedUsername,
    email: normalizedEmail,
    picture: DEFAULT_AVATAR,
    passwordHash,
    authProvider: 'local',
  }).save();

  return authPayload(user);
};

exports.signIn = async ({ login, password }) => {
  const trimmedLogin = login?.trim();

  if (!trimmedLogin || !password) {
    throw new GraphQLError('Username or email and password are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const isEmail = trimmedLogin.includes('@');
  const query = isEmail
    ? { email: trimmedLogin.toLowerCase() }
    : { username: normalizeUsername(trimmedLogin) };

  const user = await User.findOne(query).select('+passwordHash').exec();

  if (!user || !user.passwordHash) {
    throw new GraphQLError('Invalid username, email, or password', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new GraphQLError('Invalid username, email, or password', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  return authPayload(user);
};
