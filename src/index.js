import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Board from './Board';
import Api from './api';
import registerServiceWorker from './registerServiceWorker';

const Root = () => {
  Api.init();
  return (
    <Router>
      <Switch>
        <Route path="/greetings">
          <App />
        </Route>
        <Route path="/">
          <Board />
        </Route>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
