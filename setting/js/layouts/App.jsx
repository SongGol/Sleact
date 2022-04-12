import React from 'react';
import { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";

import SignUp from '@pages/SignUp';
import LogIn from '@pages/login';
import Workspace from '@layouts/Workspace'

const App = () => {
  return (
    <>
      <Router>
        <Fragment>
          <Routes>
            <Route exact path="/" element={<LogIn />}></Route>
            <Route exact path="/login" element={<LogIn />}></Route>
            <Route exact path="/signup" element={<SignUp />}></Route>
            <Route exact path="/workspace/:workspace/*" element={<Workspace />}></Route>
          </Routes>
        </Fragment>
      </Router>
    </>
  )
};

export default App;
