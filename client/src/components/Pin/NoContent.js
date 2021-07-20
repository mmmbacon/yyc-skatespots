import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import RoomIcon from '@material-ui/icons/Room';
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <RoomIcon className={classes.icon}></RoomIcon>
    <Typography  
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

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
