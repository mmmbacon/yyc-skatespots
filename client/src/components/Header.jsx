import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStore } from '../stores/useAppStore';
import UserMenu from './Auth/UserMenu';
import HeaderAuth from './Auth/HeaderAuth';

const LOGO_SRC =
  'https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-50_hpu6mg.png';

const Logo = styled('img')({
  height: '2.5em',
});

const Header = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const currentUser = useAppStore((state) => state.currentUser);
  const isAuth = useAppStore((state) => state.isAuth);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Logo src={LOGO_SRC} alt="Skateboard" />
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{
                fontSize: mobileSize ? '2.2rem' : '2.5rem',
                ml: mobileSize ? '5px' : '8px',
              }}
            >
              skatespot.app
            </Typography>
          </Box>
          {isAuth && currentUser ? (
            <UserMenu mobileSize={mobileSize} />
          ) : (
            <HeaderAuth />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
