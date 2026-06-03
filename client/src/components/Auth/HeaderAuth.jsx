import React from 'react';
import { Button } from '@mui/material';

import { useAppStore } from '../../stores/useAppStore';

const HeaderAuth = () => {
  const openAuthDialog = useAppStore((state) => state.openAuthDialog);

  return (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      onClick={openAuthDialog}
      sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
    >
      Sign in
    </Button>
  );
};

export default HeaderAuth;
