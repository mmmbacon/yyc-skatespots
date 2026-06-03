import React from 'react';
import {
  Box,
  Paper,
  Slide,
  IconButton,
  Typography,
  Divider,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CreateComment from './CreateComment';
import Comments from './Comments';
import { useAppStore } from '../../stores/useAppStore';

const CommentDrawer = ({ open, onClose, pinId, pinTitle, comments = [], isAuth }) => {
  const openAuthDialog = useAppStore((state) => state.openAuthDialog);

  if (!pinId) return null;

  const commentList = comments ?? [];

  return (
    <>
      {open ? (
        <Box
          onClick={onClose}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            bgcolor: 'rgba(0, 0, 0, 0.35)',
          }}
        />
      ) : null}
      <Slide in={open} direction="right" mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 5,
            width: { xs: 'min(90vw, 360px)', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2,
              pt: 2,
              pb: 1.5,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ pr: 1, minWidth: 0 }}>
              <Typography variant="h6" component="h2">
                Comments
                {commentList.length > 0 ? ` (${commentList.length})` : ''}
              </Typography>
              {pinTitle ? (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {pinTitle}
                </Typography>
              ) : null}
            </Box>
            <IconButton onClick={onClose} aria-label="Close" edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 2,
            }}
          >
            {commentList.length > 0 ? (
              <Comments comments={commentList} />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No comments yet. Be the first to share something about this spot.
              </Typography>
            )}
          </Box>

          <Divider />
          <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
            {isAuth ? (
              <CreateComment pinId={pinId} />
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
        </Paper>
      </Slide>
    </>
  );
};

export default CommentDrawer;
