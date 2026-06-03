import { createContext } from 'react';

const Context = createContext({
  state: {
    currentUser: null,
    idToken: null,
    isAuth: false,
    draft: null,
    pins: [],
    currentPin: null,
  },
  dispatch: () => {},
});

export default Context;
