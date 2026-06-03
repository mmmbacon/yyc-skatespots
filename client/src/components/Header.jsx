import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Context from '../context';
import Signout from './Auth/Signout';
import GoogleSignInButton from './Auth/GoogleSignInButton';

const Logo = styled('img')({
  height: '2.5em',
});

const UserPicture = styled('img')(({ theme }) => ({
  height: '35px',
  borderRadius: '90%',
  marginRight: theme.spacing(2),
}));

const Header = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const { state } = useContext(Context);
  const { currentUser, isAuth } = state;

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
            {[
              'icons8-roller-skates-50_q5iys5.png',
              'icons8-skateboard-50_hpu6mg.png',
              'icons8-rollerblade-50_kq6iwt.png',
              'icons8-heart-50_kgwnbw.png',
            ].map((icon) => (
              <Logo
                key={icon}
                src={`https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/${icon}`}
                alt="Skate"
              />
            ))}
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{
                fontSize: mobileSize ? '2.5em' : '2.5em',
                ml: mobileSize ? '5px' : '10px',
              }}
            >
              skatespot.app
            </Typography>
          </Box>
          {isAuth && currentUser ? (
            <Box display="flex" flexDirection="row" alignItems="center">
              <Box mr={1}>
                <Signout />
              </Box>
              <Box mr={1}>
                <Typography
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ display: mobileSize ? 'none' : 'block' }}
                >
                  {currentUser.name}
                </Typography>
              </Box>
              <UserPicture src={currentUser.picture} alt="Pic" />
            </Box>
          ) : (
            <GoogleSignInButton />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
