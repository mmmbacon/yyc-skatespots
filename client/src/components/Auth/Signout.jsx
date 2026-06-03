import React, { useContext } from 'react';
import { googleLogout } from '@react-oauth/google';
import { styled } from '@mui/material/styles';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Context from '../../context';

const Root = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  '& .buttonIcon': {
    marginLeft: '5px',
    color: theme.palette.text.primary,
  },
}));

const Signout = () => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const { dispatch } = useContext(Context);

  const onSignout = () => {
    googleLogout();
    dispatch({ type: 'SIGNOUT_USER' });
  };

  return (
    <Root onClick={onSignout} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSignout()}>
      <Typography
        variant="body1"
        color="textPrimary"
        sx={{ display: mobileSize ? 'none' : 'block' }}
      >
        Signout
      </Typography>
      <ExitToAppIcon className="buttonIcon" />
    </Root>
  );
};

export default Signout;
