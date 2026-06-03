import React, { useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './pages/App.jsx';
import Splash from './pages/Splash.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Context from './context';
import reducer from './reducer';
import { createApolloClient } from './apolloClient';
import { config } from './config';

import 'mapbox-gl/dist/mapbox-gl.css';

const initialState = {
  currentUser: null,
  idToken: null,
  isAuth: false,
  draft: null,
  pins: [],
  currentPin: null,
};

function Root() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const apolloClient = useMemo(
    () => createApolloClient(() => state.idToken),
    [state.idToken],
  );

  return (
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <ApolloProvider client={apolloClient}>
        <Context.Provider value={{ state, dispatch }}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <App />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Splash />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </Context.Provider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
