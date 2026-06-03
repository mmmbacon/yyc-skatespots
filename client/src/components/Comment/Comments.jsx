import React from 'react';
import {
  Avatar,
  Box,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

import { avatarSrc } from '../../config';

const StyledList = styled(List)({
  width: '100%',
  padding: 0,
});

const Comments = ({ comments }) => {
  return (
    <StyledList dense disablePadding>
      {comments.map((comment, index) => (
        <ListItem
          key={index}
          alignItems="flex-start"
          disableGutters
          sx={{ px: 0, py: 1, gap: 1 }}
        >
          <Avatar
            src={avatarSrc(comment.author.picture)}
            alt={comment.author.name}
            sx={{ width: 28, height: 28, mt: 0.25 }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'baseline' }}>
              <Typography variant="body2" fontWeight={600} component="span">
                {comment.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" component="span">
                {formatDistanceToNow(new Date(Number(comment.createdAt)))} ago
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
              {comment.text}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </StyledList>
  );
};

export default Comments;
