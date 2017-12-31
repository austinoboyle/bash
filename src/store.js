// eslint-disable-next-line
import { applyMiddleware, createStore, compose } from 'redux';
import reducers from './reducers/index';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(reducers, applyMiddleware(thunk, logger));
export default store;