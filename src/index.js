import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Board from './Board';
import Api from './api';
import registerServiceWorker from './registerServiceWorker';

Api.init();

const component = document.location.pathname.toLowerCase().indexOf('dashboard') > -1 ? <Board /> : <App />;

ReactDOM.render(component, document.getElementById('root'));
registerServiceWorker();
