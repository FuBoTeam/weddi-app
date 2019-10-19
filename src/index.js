import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import Greeting from './Greeting';
import Board from './Board';
import Api from './api';
import registerServiceWorker from './registerServiceWorker';

const Home = () => (<div>Weddi App</div>);

const Root = () => {
  Api.init();
  return (
    <Router forceRefresh>
      <Switch>
        <Route path="/:gnbId/greetings" component={Greeting} />
        <Route path="/:gnbId/" component={Board} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
