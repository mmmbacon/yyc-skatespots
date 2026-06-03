import React from 'react';
import { styled } from '@mui/material/styles';
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

export default function PinIcon({ size, title, color, isNewPin, onClick }) {
  const tooltipTitle = color
    ? color === 'hotpink'
      ? 'New Spot'
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
          color: isNewPin ? 'limegreen' : color || 'darkblue',
          cursor: onClick ? 'pointer' : 'default',
        }}
      />
    </StyledTooltip>
  );
}
