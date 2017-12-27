import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Terminal from './Terminal';
import Vim from './components/Vim/Vim';

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
