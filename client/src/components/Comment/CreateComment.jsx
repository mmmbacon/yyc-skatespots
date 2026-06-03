import React, { useState, useContext } from 'react';
import {
  InputBase,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';

import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';
import Context from '../../context';

const Form = styled('form')({
  display: 'flex',
  alignItems: 'center',
});

const StyledInput = styled(InputBase)({
  marginLeft: 8,
  flex: 1,
});

const CreateComment = () => {
  const client = useClient();
  const [comment, setComment] = useState('');
  const { state } = useContext(Context);

  const handleSubmitComment = async () => {
    await client.request(CREATE_COMMENT_MUTATION, {
      pinId: state.currentPin._id,
      text: comment,
    });
    setComment('');
  };

  return (
    <>
      <Form>
        <IconButton
          onClick={() => setComment('')}
          disabled={!comment.trim()}
          sx={{ p: 0, color: 'red' }}
        >
          <ClearIcon />
        </IconButton>
        <StyledInput
          placeholder="Add Comment"
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton
          onClick={handleSubmitComment}
          disabled={!comment.trim()}
          sx={{ p: 0, color: 'secondary.dark' }}
        >
          <SendIcon />
        </IconButton>
      </Form>
      <Divider />
    </>
  );
};

export default CreateComment;
