import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Context from '../context';
import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';
import PinContent from './Pin/PinContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Blog = ({ classes }) => {

  const mobileSize = useMediaQuery('(max-width:650px)');

  const { state, dispatch } = useContext(Context);
  const { draft, currentPin } = state;

  const handleClose = () => {
    dispatch({ type: 'SET_PIN', payload: null });
    if(draft){
      dispatch({ type: "DELETE_DRAFT"});
    }
  }

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
      square
      className={mobileSize ? classes.rootMobile : `${classes.root} ${draft || currentPin ? classes.shadow : ''}`}>
      <div class={`${classes.header} ${draft || currentPin ? '' : classes.hidden}`}>
        <IconButton onClick={handleClose}>
          <ClearIcon />
        </IconButton>
      </div>
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
    zIndex: 9999
  },
  rootMobile: {
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  },
  header: {
    display: 'flex',
    flexDirection: 'row'
  },
  hidden: {
    display: 'none',
  },
  shadow: {
    boxShadow: '-15px 0px 15px rgba(0,0,0,0.1)',
  }
};

export default withStyles(styles)(Blog);
