import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import PlaceTwoTone from '@mui/icons-material/PlaceTwoTone';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#000',
    marginLeft: 0,
  },
  '& .MuiTooltip-arrow': {
    color: '#000',
  },
});

function resolvePinColor({ color, isNewPin, theme }) {
  if (color === 'red') return theme.palette.secondary.main;
  if (color === 'hotpink') return theme.palette.primary.dark;
  if (isNewPin) return theme.palette.primary.light;
  if (color) return color;
  return theme.palette.primary.main;
}

export default function PinIcon({ size, title, color, isNewPin, onClick, draggable }) {
  const theme = useTheme();
  const pinColor = resolvePinColor({ color, isNewPin, theme });

  const tooltipTitle = color
    ? color === 'hotpink'
      ? draggable
        ? 'Drag to move, click to place'
        : 'New spot'
      : 'My Location'
    : title;

  return (
    <StyledTooltip
      title={tooltipTitle}
      placement="right"
      TransitionComponent={Zoom}
      arrow
    >
      <PlaceTwoTone
        onClick={onClick}
        sx={{
          fontSize: size,
          color: pinColor,
          cursor: draggable ? 'grab' : onClick ? 'pointer' : 'default',
        }}
      />
    </StyledTooltip>
  );
}
