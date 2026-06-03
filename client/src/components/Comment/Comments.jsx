import React from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const Comments = ({ comments }) => {
  return (
    <StyledList>
      {comments.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <Box display="flex" flexDirection="row" alignItems="center">
            <ListItemAvatar sx={{ p: 0, m: 0 }}>
              <Avatar
                src={comment.author.picture}
                alt={comment.author.name}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{ fontWeight: 400 }}
              primary={comment.text}
              secondary={
                <>
                  <Typography
                    component="span"
                    color="textPrimary"
                    sx={{ display: 'inline', fontSize: '1em', fontWeight: 500, mr: 1 }}
                  >
                    {comment.author.name}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '0.9em' }}>
                    {formatDistanceToNow(new Date(Number(comment.createdAt)))} ago
                  </Typography>
                </>
              }
            />
          </Box>
        </ListItem>
      ))}
    </StyledList>
  );
};

export default Comments;
