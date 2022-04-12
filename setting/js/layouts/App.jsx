import React from 'react';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import SignUp from '@pages/SignUp';
import LogIn from '@pages/login';
import Workspace from '@layouts/Workspace'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/workspace/:workspace" component={Workspace} />
      </Switch>
    </Router>
  )
};

export default App;
