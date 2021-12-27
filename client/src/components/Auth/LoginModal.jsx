import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Link } from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';

import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';
import { BASE_URL } from '../../client';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = vars => makeStyles( theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  social: {
    position: 'absolute',
    top: '15px',
    left: '15px'
  },
  socialText: {
    fontSize: '1.5em'
  },
  title: {
    fontSize: '3em',
    marginBottom: '0px',
    lineHeight: '1.2em',
    padding: 20
  },
  mobileTitle: {
    fontSize: '2em',
    marginBottom: '0px',
    lineHeight: '1.2em'
  },
  icon: {
    height: "40px",
    animation: `$oscillate 500ms ease-in-out ${vars.delay}s infinite`,
  },
  mobileIcon: {
    height: "50px",
    animation: `$oscillate 500ms ease-in-out ${vars.delay}s infinite`,
  },
  "@keyframes oscillate": {
    "0%": {
      transform: "translateY(-3%)"
    },
    "50%": {
      transform: "translateY(3%)"
    },
    "100%": {
      transform: "translateY(-3%)"
    },
  }
}));

const LoginModal = (props) => {

  const classes = useStyles({ delay: 1 })();
  const logo1classes = useStyles({ delay: 0 })();
  const logo2classes = useStyles({ delay: 0.1 })();
  const logo3classes = useStyles({ delay: 0.2 })();
  const logo4classes = useStyles({ delay: 0.3 })();

  const {dispatch} = useContext(Context);
  const mobileSize = useMediaQuery('(max-width:650px)');

  const onSuccess = async googleUser => {
    try{
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn }); 
      props.onSuccess();
    }catch(err){
      onFailure(err);
    }
  };

  const onFailure = err =>{
    console.error("Error Logging in ", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  }
  return <div className={classes.root}>
    <Box display="flex" flexDirection="row">
      <Box p={1} >
        <img className={ mobileSize ? logo1classes.mobileIcon : logo1classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-roller-skates-100_p7oamy.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo2classes.mobileIcon : logo2classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-skateboard-100_ts7wrr.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo3classes.mobileIcon : logo3classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-rollerblade-100_xtiixl.png" alt="preview"/>
      </Box>
      <Box p={1} >
        <img className={ mobileSize ? logo4classes.mobileIcon : logo4classes.icon} src="https://res.cloudinary.com/mmmbacon/image/upload/v1626840695/cdn/icons8-heart-96_ihytgp.png" alt="preview"/>
      </Box>
    </Box>

    <Typography
    className={mobileSize ? classes.mobileTitle : classes.title}
    component="h1"
    variant="h5"
    gutterBottom
    noWrap
    color="primary">
      Log In
    </Typography>
    <GoogleLogin 
      buttonText="Login with Google"
      clientId="643653378187-86ac0rdsdlkso7mf9g0mfdeun94dsv0k.apps.googleusercontent.com" 
      onSuccess={onSuccess}
      onFailure={onFailure}
      isSignedIn={true}
      theme="dark">
    </GoogleLogin>
      </div>
};

export default LoginModal;
