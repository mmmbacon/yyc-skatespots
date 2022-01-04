const bcrypt = require('bcrypt');

const { AuthenticationError, PubSub } = require('apollo-server');

const Pin = require('./models/Pin');
const User = require('./models/User');

const pubsub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_UPDATED = 'PIN_UPDATED';
const PIN_DELETED = 'PIN_DELETED';
const CREATE_COMMENT = 'CREATE_COMMENT';

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }

  return next(root, args, ctx, info);
};

const hash = (plaintextPassword) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plaintextPassword, salt, (errX, hashX) => {
      if (!errX) {
        return hashX;
      }
      return errX;
    });
  });
};

const compare = (plaintextPassword, hashed) => {
  bcrypt.compare(plaintextPassword, hashed, (err, result) => {
    // result == true
    if (!err) {
      return result;
    }
    return err;
  });
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({}).populate('author')
        .populate('comments.author');
      return pins;
    },
    getPinsProximity: async (root, args, ctx) => {
      const { lat, lng, rng } = args;
      const pins = await Pin.find({

        // A very poor X/Y range filter - too laz to filter within a circular range
        latitude: {
          $gt: lat - (rng / 2),
          $lt: lat + (rng / 2),
        },
        longitude: {
          $gt: lng - (rng / 2),
          $lt: lng + (rng / 2),
        },
      }).populate('author')
        .populate('comments.author');
      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({ ...args.input, author: ctx.currentUser._id }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete(
        { _id: args.pinId },
      ).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true },
      ).populate('author')
        .populate('comments.author');
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    }),
    createNewUser: async (root, args, ctx) => {
      const user = await User.find({ email: args.input.email }).exec();

      let newUser = {};

      if (user.length < 1) {
        const userInfo = {
          email: args.input.email,
          password: hash(args.input.password),
          username: args.input.username,
        };
        newUser = await new User(userInfo).save();
      }

      return newUser;
    },
    loginUser: async (root, args, ctx) => {
      const user = await User.find({ email: args.input.email }).exec();
      if (user) {
        if (compare(args.input.password, user.password)) {
          return user;
        }
      }
      return {};
    },
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED),
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED),
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED),
    },
  },
};
