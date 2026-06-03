import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './pages/App.jsx';
import AuthBootstrap from './components/Auth/AuthBootstrap';
import { createApolloClient } from './apolloClient';
import { config } from './config';
import { useAppStore } from './stores/useAppStore';

import 'mapbox-gl/dist/mapbox-gl.css';
import './mapPopup.css';

function ApolloApp({ children }) {
  const idToken = useAppStore((state) => state.idToken);
  const apolloClient = useMemo(
    () => createApolloClient(() => idToken),
    [idToken],
  );

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}

function Root() {
  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <ApolloApp>
        <AuthBootstrap>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthBootstrap>
      </ApolloApp>
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
