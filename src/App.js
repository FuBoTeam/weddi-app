import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import Api from './api';

const App = ({ match }) => {
  const path = match.url;
  Api.init();
  return (
      <Switch>
        <Route path={`${path}/greetings`} component={Greeting} />
        <Route path={path} component={Board} />
      </Switch>
  );
};

export default App;