/* eslint-disable no-console */
const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { findOrCreateGoogleUser, createBasicUser, findBasicUser } = require('./controllers/userController');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB Connected!'))
  .catch((err) => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (context) => {
    let authToken = null;
    let email = null;
    let username = null;
    let password = null;
    let currentUser = null;
    try {
      authToken = context.req.headers.authorization;
      email = context.req.body.email;
      username = context.req.body.username;
      password = context.req.body.password;

      if (authToken) {
        // Find or create user
        currentUser = await findOrCreateGoogleUser(authToken);
      }

      if (username) {
        console.log('username');
        currentUser = await createBasicUser(email, password, username);
      }

      if (email && password && !username) {
        currentUser = await findBasicUser(email, password, username);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`, err);
    }
    return { currentUser };
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server is listening on ${url}`);
});
