import React from "react";
import { withStyles } from "@material-ui/core/styles";
import RoomIcon from '@material-ui/icons/Room';
import Typography from "@material-ui/core/Typography";
import useMediaQuery from '@material-ui/core/useMediaQuery';

const NoContent = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  return (
    <div className={classes.root}>
      <RoomIcon className={ mobileSize ? classes.mobileIcon : classes.icon}></RoomIcon>
      <Typography
      className={ mobileSize ? classes.mobileText : "" }
      component="h2" 
      variant="h6" 
      align="center" 
      color="textPrimary" 
      gutterBottom>
        {`Click on a pin to see it's content
        or Click on the map to add a new pin`}
      </Typography>
    </div>
  )
}

const styles = theme => ({
  root: {
    maxWidth: 0,
    display: "none",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: "80px"
  },
  mobileIcon: {
    margin: theme.spacing(1),
    fontSize: "3em"
  },
  mobileText: {
    fontSize: "1em"
  }
});

export default withStyles(styles)(NoContent);
