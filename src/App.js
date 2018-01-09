import React from 'react';
import {connect} from 'react-redux';
import Terminal from './Terminal';
import Vim from './components/Vim/Vim/Vim';

const App = ({terminal, vim}) => {
    return terminal.isActive ? <Terminal /> : <Vim />;
    // return <Vim />;
}

function mapStateToProps(state) {
    return {
        terminal: state.terminal,
        vim: state.vim
    };
}

export default connect(mapStateToProps, null)(App);
