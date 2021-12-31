import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

import Context from '../context';
import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';
import PinContent from './Pin/PinContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Blog = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  const { state } = useContext(Context);
  const { draft, currentPin } = state;

  let BlogContent;

  if(!draft && !currentPin){
    BlogContent = NoContent;
  }else if(draft && !currentPin){
    BlogContent = CreatePin;
  }else if(!draft && currentPin){
    BlogContent = PinContent
  }

  return (
    <Paper 
      className={mobileSize ? classes.rootMobile : classes.root}>
      <BlogContent></BlogContent>
    </Paper>
  );
};

const styles = {
  root: {
    maxWidth: 350,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    justifyContent: "center",
  },
  rootMobile: {
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
