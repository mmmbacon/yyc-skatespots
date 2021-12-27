import React, { useContext } from "react";
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Context from '../../context';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const Signin = ({ classes }) => {
  
  const mobileSize = useMediaQuery('(max-width:650px)');
  const { dispatch } = useContext(Context);

  const onSignin = () => {
    dispatch( { type: "SIGNIN_USER" });
  }

  return <GoogleLogin
    onLoginSuccess={onSignin}
    render={({onClick}) => ( 
      <span className={classes.root} onClick={onClick}>
        <Typography
        variant="body1"
        className={classes.buttonText}
        color="textPrimary"
        style={{ display :  mobileSize ? "none" : "block"}}>
          Log In
        </Typography>
        <ExitToAppIcon className={classes.buttonIcon}></ExitToAppIcon>
      </span>
  )}></GoogleLogin>
};

const styles = theme => ({
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: theme.palette.text.primary
  }
});

export default withStyles(styles)(Signin);
