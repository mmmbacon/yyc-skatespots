import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import withRoot from '../withRoot';
import Login from '../components/Auth/Login';
import Context from '../context';

const Splash = () => {
  const { state } = useContext(Context);
  return state.isAuth ? <Navigate to="/" replace /> : <Login />;
};

export default withRoot(Splash);
