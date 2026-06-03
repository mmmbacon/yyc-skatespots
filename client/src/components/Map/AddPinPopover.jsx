import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CreatePin from '../Pin/CreatePin';

const Root = styled(Box)({
  maxWidth: 320,
  textAlign: 'left',
});

const AddPinPopover = () => {
  const mobileSize = useMediaQuery('(max-width: 650px)');

  return (
    <Root>
      <Typography
        variant={mobileSize ? 'subtitle1' : 'subtitle2'}
        fontWeight={600}
        component="h2"
        sx={{ mb: mobileSize ? 1 : 0.5 }}
      >
        New spot
      </Typography>
      <CreatePin />
    </Root>
  );
};

export default AddPinPopover;
