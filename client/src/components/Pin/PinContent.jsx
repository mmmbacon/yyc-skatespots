import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import PinPopover from './PinPopover';
import { useAppStore } from '../../stores/useAppStore';

const Root = styled(Box)({
  padding: '1em 0.5em',
  width: '100%',
});

const PinContent = () => {
  const currentPin = useAppStore((state) => state.currentPin);

  return (
    <Root display="flex" flexDirection="column" alignItems="center">
      <PinPopover pin={currentPin} />
    </Root>
  );
};

export default PinContent;
