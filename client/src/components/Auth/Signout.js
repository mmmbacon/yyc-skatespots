import React, { useContext } from "react";
import { GoogleLogout } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Context from '../../context';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const Signout = ({ classes }) => {
  
  const mobileSize = useMediaQuery('(max-width:650px)');
  const { dispatch } = useContext(Context);

  const onSignout = () => {
    dispatch( { type: "SIGNOUT_USER" });
  }

  return <GoogleLogout
    onLogoutSuccess={onSignout}
    render={({onClick}) => ( 
      <span className={classes.root} onClick={onClick}>
        <Typography
        variant="body1"
        className={classes.buttonText}
        color="textPrimary"
        style={{ display :  mobileSize ? "none" : "block"}}>
          Signout
        </Typography>
        <ExitToAppIcon className={classes.buttonIcon}></ExitToAppIcon>
      </span>
  )}></GoogleLogout>
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

export default withStyles(styles)(Signout);
