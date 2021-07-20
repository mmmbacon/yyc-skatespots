import React, {useContext }  from "react";
import withRoot from "../withRoot";
import { Redirect } from 'react-router-dom'
import Login from "../components/Auth/Login"
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Context from '../context';

const Splash = () => {
  const { state } = useContext(Context);
  return state.isAuth? <Redirect to="/" /> : <Login/>;
};

export default withRoot(Splash);
