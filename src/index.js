import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Board from './Board';

const component = document.location.pathname.toLowerCase().indexOf('board') > -1 ? <Board /> : <App />;

ReactDOM.render(component, document.getElementById('root'));
registerServiceWorker();
