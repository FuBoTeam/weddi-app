import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Board from './Board';
import registerServiceWorker from './registerServiceWorker';

const component = document.location.pathname.toLowerCase().indexOf('board') > -1 ? <Board /> : <App />;

ReactDOM.render(component, document.getElementById('root'));
registerServiceWorker();
