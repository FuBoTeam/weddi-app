import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Greeting } from './Greeting/Greeting';
import Board from './Board';
import { Dashboard } from './Dashboard/Dashboard';
import { Lottery } from './Lottery/Lottery';
import configService from './services/configService';
import { FirebaseAppProvider } from './Provider/FirebaseApp';

const setTitle = (title) => document.title = title;

const App = ({ match }) => {
  configService.init(match.params.gnbId);
  setTitle(configService.config.doc.title);
  const path = match.url.replace(/\/$/, '');
  return (
    <FirebaseAppProvider firebaseConfig={configService.config.firebase}>
      <Switch>
        <Route path={`${path}/lottery`} component={Lottery} />
        <Route path={`${path}/greetings`} component={Greeting} />
        <Route path={path} render={routeProps => (
          new URLSearchParams(routeProps.location.search).get('v') === 'dashboard'
            ? <Dashboard {...routeProps} />
            : <Board {...routeProps} />
        )} />
      </Switch>
    </FirebaseAppProvider>
  );
};

export default App;
