import { combineReducers } from 'redux';

// COMBINED REDUCERS
import { terminalReducer } from './terminalReducer';
import { vimReducer } from './vimReducer';

export default combineReducers({
    terminal: terminalReducer,
    vim: vimReducer
});