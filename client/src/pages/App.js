import React from "react";
import withRoot from "../withRoot";
import { withStyles, withTheme, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Header from '../components/Header';
import Map from '../components/Map';
import { deepOrange, blue } from "@material-ui/core/colors";

const App = ({ classes }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <Header></Header>
        <Map></Map>
      </div>
    </MuiThemeProvider>
  );
};

const styles = theme => ({
  root: {
    color: 'black'
  }
});

const theme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: blue,
  },
  typography: {
    h5: {
      fontSize: "2em",
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
})

export default withRoot(withStyles(styles)(App));
