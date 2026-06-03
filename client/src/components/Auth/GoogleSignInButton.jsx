import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthLogin } from '../../hooks/useAuthLogin';

const GoogleSignInButton = () => {
  const { onSuccess, onFailure } = useAuthLogin();

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
      theme="outline"
      text="signin_with"
      shape="rectangular"
      size="medium"
    />
  );
};

export default GoogleSignInButton;
