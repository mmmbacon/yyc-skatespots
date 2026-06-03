import { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import Context from '../context';
import { ME_QUERY } from '../graphql/queries';
import { config } from '../config';
import { applyAuthSession } from '../utils/authSession';

export function useAuthLogin() {
  const { dispatch } = useContext(Context);

  const onSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const client = new GraphQLClient(config.graphqlHttpUrl, {
        headers: { authorization: idToken },
      });
      const { me } = await client.request(ME_QUERY);
      applyAuthSession(dispatch, { token: idToken, user: me });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error('Error logging in', err);
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
  };

  return { onSuccess, onFailure };
}
