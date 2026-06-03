const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const Pin = require('./models/Pin');
const { signUp, signIn, toPublicUser } = require('./controllers/userController');

const pubsub = new PubSub();
const PIN_ADDED = 'PIN_ADDED';
const PIN_UPDATED = 'PIN_UPDATED';
const PIN_DELETED = 'PIN_DELETED';

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new GraphQLError('You must be logged in', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => toPublicUser(ctx.currentUser)),
    getPins: async () => {
      const pins = await Pin.find({})
        .populate('author')
        .populate('comments.author');
      return pins;
    },
  },
  Mutation: {
    signUp: (_, args) => signUp(args),
    signIn: (_, args) => signIn(args),
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true },
      )
        .populate('author')
        .populate('comments.author');
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator([PIN_ADDED]),
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator([PIN_UPDATED]),
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator([PIN_DELETED]),
    },
  },
};
