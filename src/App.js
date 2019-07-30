    
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

import { getToken } from './reducers/auth'

import Layout from "./Components/Layout/Layout.js";
import Login from "./Components/Login";
import Products from "./Components/Products";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.token
      ? <Component {...props} {...rest} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
);

const App = (props) => (
  <Layout>
    <Route exact path="/login" component={Login} />
    <PrivateRoute path="/products" component={Products} token={props.token} />
  </Layout>
)

const mapStateToProps = store => ({
  token: getToken(store)
});

export default connect(mapStateToProps)(App);