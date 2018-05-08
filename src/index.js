import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Board from './Board';
import Api from './api';
import registerServiceWorker from './registerServiceWorker';

const Root = () => {
  Api.init();
  const url = new URL(document.location.href);
  const view = url.searchParams.get('v');
  const isDashboard = view === 'dashboard';
  const Cmp = isDashboard ? Board : App;
  return <Cmp />;
};

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
