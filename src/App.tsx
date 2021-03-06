import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import Greeting from './Greeting';
import Board from './Board';
import configService from './services/configService';
import Api from './api';

const setTitle = (title: string) => document.title = title;

type AppProps = RouteComponentProps<{ gnbId: string }>

const App = ({ match }: AppProps) => {
  configService.init(match.params.gnbId);
  Api.init();
  setTitle(configService.config.doc.title);
  const path = match.url;
  return (
    <Switch>
      <Route path={`${path}/greetings`} component={Greeting} />
      <Route path={path} component={Board} />
    </Switch>
  );
};

export default App;
