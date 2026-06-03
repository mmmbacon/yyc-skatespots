import React from "react";
import withRoot from "../withRoot";
import Header from '../components/Header';
import Map from '../components/Map';
import AuthDialogHost from '../components/Auth/AuthDialogHost';


const App = () => {
  return (
    <div>
      <Header></Header>
      <Map></Map>
      <AuthDialogHost />
    </div>
  );
};

export default withRoot(App);
