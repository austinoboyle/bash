import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import App from './App';
import {initialize, pageview, set as GASet} from 'react-ga'
import styles from './index.scss';
import {getCookie} from './util';

const GA_ID = process.env.NODE_ENV === 'production' 
    ? 'UA-111948919-1'
    : 'UA-111948919-3';

initialize(GA_ID, {
    debug: process.env.NODE_ENV !== 'production'
})

if (getCookie('ga_admin')) {
    GASet({dimension1: 'true'});
}

pageview(window.location.pathname + window.location.search);

export const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
