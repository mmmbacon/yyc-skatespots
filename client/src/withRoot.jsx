import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, purple, green, pink } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      light: purple[300],
      main: pink[600],
      dark: purple[700],
    },
    secondary: {
      light: green[300],
      main: blue[500],
      dark: green[700],
    },
  },
  typography: {
    h5: {
      fontSize: '2.5em',
      fontFamily: ['Fredoka One'].join(','),
    },
    fontFamily: ['Montserrat'].join(','),
  },
});

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }
  return WithRoot;
}

export default withRoot;
