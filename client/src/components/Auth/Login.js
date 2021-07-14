import React from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {

  const ME_QUERY = `
  {
    me{
      _id
      name
      email
      picture
    }
  }
  `
  const onSuccess = async googleUser => {
    const idToken = googleUser.getAuthResponse().id_token;
    const client = new GraphQLClient('http://localhost:4000/graphql', {
      headers: { authorization: idToken }
    });
    const data = await client.request(ME_QUERY);
    console.log({ data })
  }

  return <GoogleLogin 
  clientId="643653378187-86ac0rdsdlkso7mf9g0mfdeun94dsv0k.apps.googleusercontent.com" 
  onSuccess={onSuccess}
  isSignedIn={true}></GoogleLogin>
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
