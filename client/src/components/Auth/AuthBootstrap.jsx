import { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';

import { APP_BUILD_ID } from '../../appBuild';
import { ME_QUERY } from '../../graphql/queries';
import { config } from '../../config';
import { getStoredToken, clearStoredToken } from '../../utils/authStorage';
import { applyAuthSession } from '../../utils/authSession';
import { useAppStore } from '../../stores/useAppStore';

const BUILD_STORAGE_KEY = 'skatespot_app_build';

const AuthBootstrap = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const previous = localStorage.getItem(BUILD_STORAGE_KEY);
      if (previous && previous !== APP_BUILD_ID) {
        localStorage.setItem(BUILD_STORAGE_KEY, APP_BUILD_ID);
        window.location.reload();
        return;
      }
      localStorage.setItem(BUILD_STORAGE_KEY, APP_BUILD_ID);
    } catch {
      // ignore blocked storage
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) setReady(true);
        return;
      }

      useAppStore.setState({ idToken: token });

      try {
        const client = new GraphQLClient(config.graphqlHttpUrl, {
          headers: { authorization: token },
        });
        const { me } = await client.request(ME_QUERY);
        if (!cancelled) {
          applyAuthSession({ token, user: me });
        }
      } catch (err) {
        console.error('Could not restore session', err);
        clearStoredToken();
        if (!cancelled) {
          useAppStore.getState().signOut();
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  return children;
};

export default AuthBootstrap;
