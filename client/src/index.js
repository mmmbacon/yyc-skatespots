import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';

import App from "./pages/App";
import Splash from "./pages/Splash";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Context from './context';
import Reducer from './reducer';

import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { AccountsGraphQLClient } from '@accounts/graphql-client';
import { ApolloLink } from '@apollo/client';
import { accountsLink } from '@accounts/apollo-link';

const wsLink = new WebSocketLink({
  uri: process.env.NODE_ENV === "production" ? 
  "wss://geopinr.herokuapp.com/graphql" : "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
  }
});

const authLink = accountsLink(() => accountsClient);

const client = new ApolloClient({
  link: ApolloLink.from([wsLink, authLink]),
  cache: new InMemoryCache()
});

const accountsGraphQL = new AccountsGraphQLClient({
  graphQLClient: client,
  //other options like 'userFieldsFragment'
});

const accountsClient = new AccountsClient(
  {
    // accountsClient Options
  },
  accountsGraphQL
);


const passwordClient = new AccountsClientPassword(accountsClient);

const Root = () => {

  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Router>
      <ApolloProvider client={client}>
        <Context.Provider value={{ state, dispatch }}>
          <Routes>
            <Route exact path="/" component={App} />
            <Route path="/register" component={Register} />
            <Route path="/settings" component={Settings} />
          </Routes>
        </Context.Provider>
      </ApolloProvider>
      
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
