import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from './Terminal';
import {Provider} from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import App from './App';

const app = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
