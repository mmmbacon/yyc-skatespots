import React, {useContext }  from "react";
import withRoot from "../withRoot";
import { Redirect } from 'react-router-dom'
import Header from "../components/Header";

import Context from '../context';

const Settings = () => {
  const { state } = useContext(Context);
  return state.isAuth ? (
    <div>
      <Header></Header>
    </div>
  ) : (
    <div></div>
  );
};

export default withRoot(Settings);
