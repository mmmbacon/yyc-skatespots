import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';
import { useAppStore } from '../../stores/useAppStore';

const CreateComment = ({ pinId: pinIdProp, onPosted }) => {
  const client = useClient();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const currentPin = useAppStore((state) => state.currentPin);

  const pinId = pinIdProp ?? currentPin?._id;
  if (!pinId) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = comment.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await client.request(CREATE_COMMENT_MUTATION, { pinId, text });
      setComment('');
      onPosted?.();
    } catch (err) {
      console.error(err);
      setError('Could not post your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', boxSizing: 'border-box' }}
    >
      <TextField
        id="pin-comment"
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        size="small"
        placeholder="What do you think of this spot?"
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        error={Boolean(error)}
        helperText={
          error || 'Enter to post · Shift+Enter for a new line'
        }
        FormHelperTextProps={{ sx: { mx: 0, mt: 0.5 } }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 1,
          mt: 1,
        }}
      >
        {comment.trim() ? (
          <Button
            type="button"
            size="small"
            color="inherit"
            onClick={() => {
              setComment('');
              setError(null);
            }}
            disabled={submitting}
          >
            Clear
          </Button>
        ) : null}
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={!comment.trim() || submitting}
          startIcon={
            submitting ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <SendIcon fontSize="small" />
            )
          }
        >
          {submitting ? 'Posting…' : 'Post'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateComment;
