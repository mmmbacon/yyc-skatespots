import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import format from 'date-fns/format';

import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';
import Context from '../../context';

const PinContent = ({ classes }) => {

  const { state } = useContext(Context);
  const { title, image, content, author, createdAt, comments } = state.currentPin

  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" className={classes.root}>
      <Box ml={1.5}>
        <img src={image} alt={content} width="100%"/>
      </Box>
      <Typography
        component="h2" 
        variant="h4" 
        color="primary" 
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        className={classes.text} 
        component="h3" 
        variant="h6" 
        color="inherit" 
        gutterBottom
      >
        <img className={classes.picture}
          src={author.picture}
          alt="Pic"
        />
        {author.name}
      </Typography>
      <Typography
        className={classes.text} 
        variant="subtitle2" 
        color="inherit" 
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />
        {format(Number(createdAt), "MMM Do, YYYY")}
      </Typography>
      <Typography
        variant="subtitle1" 
        gutterBottom
      >
       {content}
      </Typography>

      {/* Pin Comments */}
      <CreateComment></CreateComment>
      <Comments comments={comments}></Comments>
    
    </Box>
  )
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%",
    justifyContent: "center"
  },
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  picture: {
    height: "35px",
    borderRadius: "90%",
    marginRight: theme.spacing(1)
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
