import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  TextField,
  Typography,
  Button,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhotoTwoTone';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/SaveTwoTone';

import Context from '../../context';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';
import { config, DEFAULT_PIN_IMAGE } from '../../config';

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  paddingBottom: theme.spacing(1),
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const CreatePin = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleDeleteDraft = () => {
    setTitle('');
    setImage(null);
    setContent('');
    dispatch({ type: 'DELETE_DRAFT' });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const url = image ? await handleImageUpload() : config.defaultPinImage;
      const { latitude, longitude } = state.draft;
      await client.request(CREATE_PIN_MUTATION, {
        title,
        image: url,
        content,
        latitude,
        longitude,
      });
      handleDeleteDraft();
    } catch (err) {
      console.error('Error creating pin', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'geopinr');
    data.append('cloud_name', 'mmmbacon');
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/mmmbacon/image/upload',
      data,
    );
    return res.data.url;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Box ml={1.5}>
        {image ? (
          <img src={URL.createObjectURL(image)} alt="preview" width="100%" />
        ) : (
          <Box p={1}>
            <img src={DEFAULT_PIN_IMAGE} alt="Default spot preview" width="100%" />
          </Box>
        )}
      </Box>
      <Typography variant="h6" color="primary" align="center">
        Post a new skate spot
      </Typography>
      <Box p={1}>
        <TextField
          name="title"
          label="title"
          placeholder="Skate Spot Title"
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
        />
        <HiddenInput
          accept="image/*"
          id="image"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button component="span" size="small" sx={{ color: image ? 'green' : undefined }}>
            <AddAPhotoIcon />
          </Button>
        </label>
      </Box>
      <Box sx={{ mx: 1, width: '95%' }}>
        <TextField
          name="content"
          label="Spot Description and Notes"
          multiline
          rows={mobileSize ? 3 : 6}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>
      <Box>
        <Button variant="contained" color="primary" onClick={handleDeleteDraft}>
          <ClearIcon sx={{ mr: 1 }} />
          Discard
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || submitting}
          onClick={handleSubmit}
        >
          <SaveIcon sx={{ ml: 1 }} />
          Submit
        </Button>
      </Box>
    </Form>
  );
};

export default CreatePin;
