import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';

const ABOUT_DISMISSED_KEY = 'skatespot_about_dismissed';

const PanelWrap = styled(Box)({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
  pointerEvents: 'none',
  maxWidth: 'calc(100% - 24px)',
});

const Panel = styled(Paper)(({ theme }) => ({
  pointerEvents: 'auto',
  padding: theme.spacing(2),
  borderRadius: 12,
  maxWidth: 320,
  boxShadow: theme.shadows[4],
}));

const AboutPanel = () => {
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const [open, setOpen] = useState(
    () => localStorage.getItem(ABOUT_DISMISSED_KEY) !== '1',
  );

  const handleClose = () => {
    localStorage.setItem(ABOUT_DISMISSED_KEY, '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <PanelWrap>
      <Panel elevation={4} sx={{ maxWidth: mobileSize ? 280 : 320 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} component="h2">
            Welcome to Skatespot.app!
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="Close"
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" component="p">
          A community map for sharing skate spots. Explore pins, photos, and comments on
          the map. Sign in to add spots and share what you know.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="p"
          sx={{ mt: 1.25 }}
        >
          This build is a portfolio demo focused on the Calgary area. Use the
          toolbar to add a spot or tap a pin for details.
        </Typography>
      </Panel>
    </PanelWrap>
  );
};

export default AboutPanel;
