import React, { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';

import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';
import Context from '../../context';

const Root = styled(Box)(({ theme }) => ({
  padding: '1em 0.5em',
  textAlign: 'center',
  width: '100%',
  justifyContent: 'center',
}));

const Picture = styled('img')(({ theme }) => ({
  height: '35px',
  borderRadius: '90%',
  marginRight: theme.spacing(1),
}));

const TextRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .icon': {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const PinContent = () => {
  const { state } = useContext(Context);
  const { title, image, content, author, createdAt, comments } = state.currentPin;
  const { isAuth } = state;

  return (
    <Root display="flex" flexDirection="column" alignItems="center">
      <Box ml={1.5}>
        <img src={image} alt={content} width="100%" />
      </Box>
      <Typography component="h2" variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <TextRow>
        <Picture src={author.picture} alt="Pic" />
        <Typography component="h3" variant="h6" color="inherit" gutterBottom>
          {author.name}
        </Typography>
      </TextRow>
      <TextRow>
        <AccessTimeIcon className="icon" />
        <Typography variant="subtitle2" color="inherit" gutterBottom>
          {format(new Date(Number(createdAt)), 'MMM do, yyyy')}
        </Typography>
      </TextRow>
      <Typography variant="subtitle1" gutterBottom>
        {content}
      </Typography>
      {isAuth ? (
        <CreateComment />
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Sign in to add a comment.
        </Typography>
      )}
      <Comments comments={comments} />
    </Root>
  );
};

export default PinContent;
