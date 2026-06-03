import React, { useContext } from 'react';
import { Paper, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Context from '../context';
import NoContent from './Pin/NoContent';
import CreatePin from './Pin/CreatePin';
import PinContent from './Pin/PinContent';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'mobile',
})(({ mobile }) => ({
  minWidth: mobile ? undefined : 350,
  maxWidth: mobile ? '100%' : 400,
  maxHeight: mobile ? 300 : 'calc(100vh - 64px)',
  overflowY: 'scroll',
  overflowX: mobile ? 'hidden' : undefined,
  display: 'flex',
  justifyContent: 'center',
}));

const Blog = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const { state } = useContext(Context);
  const { draft, currentPin } = state;

  let BlogContent = NoContent;
  if (draft && !currentPin) BlogContent = CreatePin;
  else if (!draft && currentPin) BlogContent = PinContent;

  return (
    <StyledPaper mobile={mobileSize}>
      <BlogContent />
    </StyledPaper>
  );
};

export default Blog;
