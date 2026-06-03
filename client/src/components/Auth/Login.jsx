import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GraphQLClient } from 'graphql-request';
import { Box, Link, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';

import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';
import { config } from '../../config';

const Root = styled('div')({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
});

const Social = styled(Box)({
  position: 'absolute',
  top: '15px',
  left: '15px',
});

const OscillateIcon = styled('img')(({ delay }) => ({
  animation: `oscillate 500ms ease-in-out ${delay}s infinite`,
  '@keyframes oscillate': {
    '0%': { transform: 'translateY(-3%)' },
    '50%': { transform: 'translateY(3%)' },
    '100%': { transform: 'translateY(-3%)' },
  },
}));

const Login = () => {
  const { dispatch } = useContext(Context);
  const mobileSize = useMediaQuery('(max-width:650px)');

  const onSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const client = new GraphQLClient(config.graphqlHttpUrl, {
        headers: { authorization: idToken },
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: 'SET_ID_TOKEN', payload: idToken });
      dispatch({ type: 'LOGIN_USER', payload: me });
      dispatch({ type: 'IS_LOGGED_IN', payload: true });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = (err) => {
    console.error('Error Logging in ', err);
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
  };

  return (
    <Root>
      <Social display="flex" flexDirection="row" alignItems="center">
        <Link href="https://github.com/mmmbacon" target="_blank" rel="noreferrer">
          <Box display="flex" alignItems="center">
            <GitHubIcon color="primary" />
            <Box pl={1}>
              <Typography variant="h5">mmmbacon</Typography>
            </Box>
          </Box>
        </Link>
      </Social>
      <Box display="flex" flexDirection="row">
        {[
          'icons8-roller-skates-100_p7oamy.png',
          'icons8-skateboard-100_ts7wrr.png',
          'icons8-rollerblade-100_xtiixl.png',
          'icons8-heart-96_ihytgp.png',
        ].map((icon, i) => (
          <Box p={1} key={icon}>
            <OscillateIcon
              delay={i * 0.1}
              style={{ height: mobileSize ? 50 : undefined }}
              src={`https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/${icon}`}
              alt="preview"
            />
          </Box>
        ))}
      </Box>
      <Typography
        component="h1"
        variant="h5"
        gutterBottom
        noWrap
        color="primary"
        sx={{ fontSize: mobileSize ? '3em' : '5em', lineHeight: 1.2, mb: 0 }}
      >
        skatespot.app
      </Typography>
      <Typography
        component="h1"
        variant="h5"
        gutterBottom
        noWrap
        color="primary"
        sx={{ fontSize: mobileSize ? '1.5em' : '2em' }}
      >
        find your bearings
      </Typography>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFailure}
        useOneTap
        theme="filled_black"
        text="signin_with"
        shape="rectangular"
      />
    </Root>
  );
};

export default Login;
