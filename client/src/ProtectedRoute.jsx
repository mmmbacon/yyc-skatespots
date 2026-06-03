import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Context from './context';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(Context);
  if (!state.isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
