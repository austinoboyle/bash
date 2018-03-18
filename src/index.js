import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import App from './App';
import {initialize, pageview} from 'react-ga'
import styles from './index.scss';

const GA_ID = process.env.NODE_ENV === 'production' 
    ? 'UA-111948919-1'
    : 'UA-111948919-3';

initialize(GA_ID, {
    debug: process.env.NODE_ENV !== 'production'
})
pageview(window.location.pathname + window.location.search);

export const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
