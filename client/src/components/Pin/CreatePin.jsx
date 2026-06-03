import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  TextField,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

import { useAppStore } from '../../stores/useAppStore';
import { CREATE_PIN_MUTATION } from '../../graphql/mutations';
import { useClient } from '../../client';
import { config } from '../../config';

const HiddenInput = styled('input')({
  display: 'none',
});

const CreatePin = () => {
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const client = useClient();
  const draft = useAppStore((state) => state.draft);
  const deleteDraft = useAppStore((state) => state.deleteDraft);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setImage(null);
    setContent('');
  };

  const handleDiscard = () => {
    resetForm();
    deleteDraft();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim() || !draft || submitting) return;

    setSubmitting(true);
    try {
      const imageUrl = image ? await uploadImage() : config.defaultPinImage;
      await client.request(CREATE_PIN_MUTATION, {
        title: title.trim(),
        image: imageUrl,
        content: content.trim(),
        latitude: draft.latitude,
        longitude: draft.longitude,
      });
      handleDiscard();
    } catch (err) {
      console.error('Error creating pin', err);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadImage = async () => {
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

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', boxSizing: 'border-box' }}
    >
      <Stack spacing={mobileSize ? 2.5 : 1.5}>
        {draft && mobileSize ? (
          <Typography variant="caption" color="text.secondary">
            At your current location
          </Typography>
        ) : null}

        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            Photo
          </Typography>
          <HiddenInput
            accept="image/*"
            id="add-pin-image"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
          {previewUrl ? (
            <Box
              sx={{
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="Spot photo preview"
                sx={{
                  width: '100%',
                  height: mobileSize ? 200 : 112,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          ) : (
            <Box
              component="label"
              htmlFor="add-pin-image"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                width: '100%',
                minHeight: mobileSize ? 140 : 88,
                px: 2,
                py: mobileSize ? 3 : 2,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'action.hover',
                cursor: 'pointer',
                boxSizing: 'border-box',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.selected',
                },
              }}
            >
              <AddAPhotoIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Tap to upload a photo
              </Typography>
              <Typography variant="caption" color="text.disabled" textAlign="center">
                Optional. A default image is used if you skip
              </Typography>
            </Box>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, width: '100%' }}>
            <Button
              component="label"
              htmlFor="add-pin-image"
              variant="outlined"
              fullWidth
              startIcon={<AddAPhotoIcon />}
            >
              {previewUrl ? 'Change photo' : 'Choose photo'}
            </Button>
            {previewUrl ? (
              <Button
                type="button"
                variant="text"
                color="inherit"
                onClick={() => setImage(null)}
              >
                Remove
              </Button>
            ) : null}
          </Stack>
        </Box>

        <TextField
          label="Spot name"
          placeholder="e.g. Shaw Millennium Park"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          autoComplete="off"
        />

        <TextField
          label="Description"
          placeholder="What’s good here? Surface, bust factor, best time to go…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          required
          multiline
          minRows={mobileSize ? 4 : 2}
          maxRows={mobileSize ? 8 : 3}
        />

        <Divider />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={handleDiscard}
            disabled={submitting}
            startIcon={<ClearIcon />}
          >
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!title.trim() || !content.trim() || submitting}
            startIcon={<SaveIcon />}
          >
            {submitting ? 'Posting…' : 'Post spot'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CreatePin;
