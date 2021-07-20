import React from "react";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import { deepOrange, blue, purple, green } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createTheme({
  palette: {
    primary: {
      light: purple[300],
      main: deepOrange[500],
      dark: purple[700]
    },
    secondary: {
      light: green[300],
      main: blue[500],
      dark: green[700]
    }
  },
  typography: {
    useNextVariants: true,
    h5: {
      fontSize: "2.5em",
      fontFamily: [
        'Fredoka One',
        // 'Montserrat'
      ].join(','),
    },
    fontFamily: [
      // 'Fredoka One',
      'Montserrat'
    ].join(','),
  }
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* https://material-ui.com/getting-started/usage/#cssbaseline */}
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
