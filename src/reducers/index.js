import { combineReducers } from 'redux';

// COMBINED REDUCERS
import { terminalReducer } from './terminalReducer';

export default combineReducers({
    terminal: terminalReducer,
});