import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { config } from './config';

export function createApolloClient(getToken) {
  const httpLink = new HttpLink({
    uri: config.graphqlHttpUrl,
    headers: {
      authorization: getToken() || '',
    },
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: config.graphqlWsUrl,
      connectionParams: () => ({
        authorization: getToken() || '',
      }),
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}
