import React from 'react';
import {connect} from 'react-redux';
import Terminal from './Terminal';
import Vim from './components/Vim/Vim/Vim';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

export const App = ({isTerminalActive}) => {
    return isTerminalActive ? <Terminal /> : <Vim />;
}

App.propTypes = exact({
    isTerminalActive: PropTypes.bool
});

function mapStateToProps(state) {
    return {
        isTerminalActive: state.terminal.isActive
    };
}

export default connect(mapStateToProps, null)(App);
