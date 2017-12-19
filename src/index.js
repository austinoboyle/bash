import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from './Terminal';
import {Provider} from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import registerServiceWorker from './registerServiceWorker';

import reducers from './reducers/index';

const store = createStore(reducers);

const app = (
    <Provider store={store}>
        <Terminal />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
