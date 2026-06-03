import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthLogin } from '../../hooks/useAuthLogin';

const GoogleSignInButton = ({ onSuccess }) => {
  const { onSuccess: handleGoogleSuccess, onFailure } = useAuthLogin();

  const handleSuccess = async (credentialResponse) => {
    await handleGoogleSuccess(credentialResponse);
    onSuccess?.();
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={onFailure}
      theme="outline"
      text="signin_with"
      shape="rectangular"
      size="medium"
    />
  );
};

export default GoogleSignInButton;
