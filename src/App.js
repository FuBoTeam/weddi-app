import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import Config from './services/config';
import Api from './api';

const setTitle = (title) => document.title = title;

const App = ({ match }) => {
  Config.init(match.params.gnbId);
  Api.init(Config);
  setTitle(Config.doc.title);
  const path = match.url;
  return (
    <Switch>
      <Route path={`${path}/greetings`} component={Greeting} />
      <Route path={path} component={Board} />
    </Switch>
  );
};

export default App;
