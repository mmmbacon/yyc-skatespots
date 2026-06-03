import { useContext, useMemo } from 'react';
import { GraphQLClient } from 'graphql-request';
import Context from './context';
import { config } from './config';

export function useClient() {
  const { state } = useContext(Context);
  return useMemo(
    () =>
      new GraphQLClient(config.graphqlHttpUrl, {
        headers: { authorization: state.idToken || '' },
      }),
    [state.idToken],
  );
}
