import React from 'react';
import {
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { format } from 'date-fns';

import Comments from '../Comment/Comments';
import { pinImageSrc, avatarSrc } from '../../config';
import { useAppStore } from '../../stores/useAppStore';
import { recentComments } from '../../utils/recentComments';

const Root = styled(Box)({
  maxWidth: 320,
  textAlign: 'left',
});

const HeroImage = styled('img')({
  width: '100%',
  maxHeight: 180,
  objectFit: 'cover',
  borderRadius: 4,
  display: 'block',
});

const AuthorAvatar = styled('img')(({ theme }) => ({
  height: 28,
  width: 28,
  borderRadius: '50%',
  marginRight: theme.spacing(1),
}));

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(0.5),
}));

const PinPopover = ({ pin, showDelete, onDelete, onOpenCommentDrawer }) => {
  const isAuth = useAppStore((state) => state.isAuth);
  const openAuthDialog = useAppStore((state) => state.openAuthDialog);
  const {
    title,
    image,
    content,
    author,
    createdAt,
    comments,
    latitude,
    longitude,
  } = pin;

  const allComments = comments ?? [];
  const previewComments = recentComments(allComments, 2);
  const hasMoreComments = allComments.length > previewComments.length;

  return (
    <Root>
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ position: 'relative', mb: 1 }}>
          <HeroImage src={pinImageSrc(image)} alt={title} />
          {showDelete && (
            <IconButton
              size="small"
              onClick={onDelete}
              aria-label="Delete pin"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          )}
        </Box>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <Row>
          <AuthorAvatar src={avatarSrc(author.picture)} alt="" />
          <Typography variant="body2" fontWeight={500}>
            {author.name}
          </Typography>
        </Row>
        <Row>
          <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="caption" color="text.secondary">
            {format(new Date(Number(createdAt)), 'MMM d, yyyy')}
          </Typography>
        </Row>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Typography>
        {content ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {content}
          </Typography>
        ) : null}
      </Box>
      <Divider sx={{ my: 1.5, flexShrink: 0 }} />
      <Typography variant="subtitle2" gutterBottom sx={{ flexShrink: 0 }}>
        Comments
        {allComments.length > 0 ? ` (${allComments.length})` : ''}
      </Typography>
      <Box sx={{ mb: 1 }}>
        {previewComments.length > 0 ? (
          <Comments comments={previewComments} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        )}
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        {isAuth ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={onOpenCommentDrawer}
          >
            {hasMoreComments ? 'View all comments' : 'Add a comment'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            <Link
              component="button"
              variant="body2"
              onClick={openAuthDialog}
              sx={{ verticalAlign: 'baseline' }}
            >
              Sign in
            </Link>
            {' to add a comment.'}
          </Typography>
        )}
      </Box>
    </Root>
  );
};

export default PinPopover;
