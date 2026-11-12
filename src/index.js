import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { Landing } from './Landing/Landing';
import registerServiceWorker from './registerServiceWorker';

const Home = Landing;

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
