import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const Home = () => (<div>Weddi App <a href="mailto:contact@weddi.app">聯絡我們 contact@weddi.app</a></div>);

const Root = () => {
  return (
    <Router basename={process.env.PUBLIC_URL} forceRefresh>
      <Switch>
        <Route path="/:gnbId/" component={App} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
