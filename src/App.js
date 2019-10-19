import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import Configs from './configs';
import Api from './api';

const setTitle = (title) => document.title = title;

const App = ({ match }) => {
  const gnbId = match.params.gnbId;
  Configs.init(gnbId);
  Api.init();
  setTitle(Configs.getDocConfig().title);
  const path = match.url;
  return (
    <Switch>
      <Route path={`${path}/greetings`} component={Greeting} />
      <Route path={path} component={Board} />
    </Switch>
  );
};

export default App;
