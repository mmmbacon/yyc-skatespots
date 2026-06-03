import React from 'react';
import { Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import RoomIcon from '@mui/icons-material/Room';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StyledIcon = styled(RoomIcon, {
  shouldForwardProp: (prop) => prop !== 'mobile',
})(({ theme, mobile }) => ({
  margin: theme.spacing(1),
  fontSize: mobile ? '3em' : '80px',
}));

const NoContent = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');

  return (
    <Root>
      <StyledIcon mobile={mobileSize} />
      <Typography
        component="h2"
        variant="h6"
        align="center"
        color="textPrimary"
        gutterBottom
        sx={{ fontSize: mobileSize ? '1em' : undefined }}
      >
        Click a pin to view details. Sign in to add spots on the map.
      </Typography>
    </Root>
  );
};

export default NoContent;
