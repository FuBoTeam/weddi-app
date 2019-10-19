import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import Api from './api';
import Images from './images';
import Configs from './configs';

const App = ({ match }) => {
  const gnbId = match.params.gnbId;
  Configs.init(gnbId);
  Api.init(gnbId);
  Images.init(gnbId);
  const path = match.url;
  return (
      <Switch>
        <Route path={`${path}/greetings`} component={Greeting} />
        <Route path={path} component={Board} />
      </Switch>
  );
};

export default App;