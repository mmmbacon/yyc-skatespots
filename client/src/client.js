import { useMemo } from 'react';
import { GraphQLClient } from 'graphql-request';

import { config } from './config';
import { useAppStore } from './stores/useAppStore';

export function useClient() {
  const idToken = useAppStore((state) => state.idToken);
  return useMemo(
    () =>
      new GraphQLClient(config.graphqlHttpUrl, {
        headers: { authorization: idToken || '' },
      }),
    [idToken],
  );
}
