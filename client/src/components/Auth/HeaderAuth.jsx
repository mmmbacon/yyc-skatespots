import React, { useState } from 'react';
import { Button } from '@mui/material';
import AuthDialog from './AuthDialog';

const HeaderAuth = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={() => setDialogOpen(true)}
        sx={{ borderColor: 'rgba(255,255,255,0.5)' }}
      >
        Sign in
      </Button>
      <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};

export default HeaderAuth;
