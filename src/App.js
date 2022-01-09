import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import { Lottery } from './Lottery/Lottery';
import configService from './services/configService';
import { FirebaseAppProvider } from './Provider/FirebaseApp';

const setTitle = (title) => document.title = title;

const App = ({ match }) => {
  configService.init(match.params.gnbId);
  setTitle(configService.config.doc.title);
  const path = match.url;
  return (
    <FirebaseAppProvider firebaseConfig={configService.config.firebase}>
      <Switch>
        <Route path={`${path}/lottery`} component={Lottery} />
        <Route path={`${path}/greetings`} component={Greeting} />
        <Route path={path} component={Board} />
      </Switch>
    </FirebaseAppProvider>
  );
};

export default App;
