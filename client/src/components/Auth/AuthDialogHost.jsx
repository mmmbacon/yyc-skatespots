import React from 'react';

import { useAppStore } from '../../stores/useAppStore';
import AuthDialog from './AuthDialog';

const AuthDialogHost = () => {
  const authDialogOpen = useAppStore((state) => state.authDialogOpen);
  const closeAuthDialog = useAppStore((state) => state.closeAuthDialog);

  return (
    <AuthDialog open={authDialogOpen} onClose={closeAuthDialog} />
  );
};

export default AuthDialogHost;
