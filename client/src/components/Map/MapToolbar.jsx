import React from 'react';
import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CloseIcon from '@mui/icons-material/Close';

import { useAppStore } from '../../stores/useAppStore';

const toolbarPosition = {
  position: 'absolute',
  top: 12,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  maxWidth: 'calc(100% - 24px)',
};

const PlacementBar = styled('div')(({ theme }) => ({
  ...toolbarPosition,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.25, 2.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: theme.shadows[4],
}));

const MapToolbar = ({
  placementMode,
  placementDesktop,
  isLocatingForPin,
  onAddPin,
  onCancelAdd,
  onConfirmPlacement,
}) => {
  const isAuth = useAppStore((state) => state.isAuth);
  const openAuthDialog = useAppStore((state) => state.openAuthDialog);

  const handleAddClick = () => {
    if (!isAuth) {
      openAuthDialog();
      return;
    }
    onAddPin();
  };

  if (!placementMode) {
    return (
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddLocationAltIcon />}
        onClick={handleAddClick}
        disabled={isLocatingForPin}
        sx={toolbarPosition}
      >
        {isLocatingForPin ? 'Finding you…' : 'Add spot'}
      </Button>
    );
  }

  return (
    <PlacementBar>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: { xs: 220, sm: 400 } }}
      >
        {placementDesktop
          ? 'Click on the map to place your spot.'
          : 'Drag the pin or tap the map where this spot should go.'}
      </Typography>
      {!placementDesktop ? (
        <Button
          size="small"
          variant="contained"
          onClick={onConfirmPlacement}
        >
          Place here
        </Button>
      ) : null}
      <Button
        size="small"
        color="inherit"
        startIcon={<CloseIcon />}
        onClick={onCancelAdd}
      >
        Cancel
      </Button>
    </PlacementBar>
  );
};

export default MapToolbar;
