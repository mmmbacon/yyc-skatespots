import { GraphQLClient } from 'graphql-request';

import { GOOGLE_SIGN_IN_MUTATION } from '../graphql/mutations';
import { config } from '../config';
import { applyAuthSession } from '../utils/authSession';
import { useAppStore } from '../stores/useAppStore';

export function useAuthLogin() {
  const onSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const client = new GraphQLClient(config.graphqlHttpUrl);
      const { googleSignIn } = await client.request(GOOGLE_SIGN_IN_MUTATION, {
        idToken,
      });
      applyAuthSession(googleSignIn);
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error('Error logging in', err);
    useAppStore.setState({ isAuth: false });
  };

  return { onSuccess, onFailure };
}
