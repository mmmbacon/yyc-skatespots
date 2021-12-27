import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { 
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
} from "@material-ui/core";
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

const Comments = ({ comments, classes }) => {
  return (
    <List className={classes.root}>
      {comments.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box alignItems="center">
              <ListItemAvatar className={classes.avatar}>
                <Avatar src={comment.author.picture} alt={comment.author.name}></Avatar>
              </ListItemAvatar>
            </Box>
            <ListItemText
              className={classes.comment}
              primary={comment.text} 
              secondary={
                <>
                  <Typography 
                    className={ `${classes.inline} ${classes.author}` }
                    component="span" 
                    color="textPrimary">
                      {comment.author.name}
                  </Typography>
                  <Typography className={classes.date} component="span">
                    {distanceInWordsToNow(Number(comment.createdAt))} ago
                  </Typography>
                </>
            }>
            </ListItemText>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  comment:{
    fontWeight: 400
  },
  date: {
    fontSize: "0.9em"
  },
  author: {
    fontSize: "1em",
    fontWeight: 500,
    marginRight: theme.spacing(1)
  },
  avatar: {
    padding: '0px',
    margin: '0px'
  }
});

export default withStyles(styles)(Comments);
