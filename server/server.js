/* eslint-disable import/extensions */
/* eslint-disable no-console */
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { Mongo as MongoDBInterface } from '@accounts/mongo';
import { AccountsModule } from '@accounts/graphql-api';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

import mongoose from 'mongoose';

import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import typeDefs from './typeDefs.js';
import { resolvers } from './resolvers.js';

// import {
//   findOrCreateGoogleUser,
//   createBasicUser,
//   findBasicUser
// } from './controllers/userController';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('DB Connected!'))
  .catch((err) => console.error(err));

const db = mongoose.connection;

const password = new AccountsPassword({});

const accountsServer = new AccountsServer(
  {
    db: new MongoDBInterface(db),
    tokenSecret: 'asdfae234ds25@#$',
  },
  {
    password,
  },
);

const accountsGraphQL = AccountsModule.forRoot({ accountsServer });

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
  resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
  context: async (req) => ({
    ...(await accountsGraphQL.context(req)),
  }),
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server is listening on ${url}`);
});
