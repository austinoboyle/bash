import React, {Component} from 'react';

import TerminalInput from '../../components/TerminalInput';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {submitCommand} from '../../actions/terminalActions';
import { goToPath, pathStringToArray } from '../../util';

import Vim_Command from './Vim_Command';
import Vim_Editor from './Vim_Editor';

import 'brace/mode/java';
import 'brace/theme/github';

// Important Keys
const ENTER = 13;
const TAB = 9;
const UPARROW = 38;
const DOWNARROW = 40;
const ESC = 27;
const I = 73;
const SEMICOLON = 186;

// Directions
const FORWARD = 1;
const BACKWARD = -1;
class Vim extends Component {
    constructor(props) {
        super(props);
        console.log('PATHTOFILE', props.pathToFile);
        const fullPathToFile = props.terminalPath.concat(props.pathToFile);
        const fileText = goToPath(props.dirTree, fullPathToFile);
        this.state = {
            initialText: fileText
        };
    }

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    }

    handleCommandChange(newValue) {
        this.setState({
            command: newValue
        });
    }

    submitCommand(command){
        console.log('SUBMITTED COMMAND:', command);
    }

    render() {
        const {terminalPath, pathToFile, dirTree} = {...this.props};
        const {initialText} = {...this.state};
        return (
            <div id="vim-wrapper">
                <Vim_Editor 
                    submitCommand={(e) => this.submitCommand(e)}
                    initialText={initialText} 
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        terminalPath: state.terminal.path,
        pathToFile: state.terminal.vim.pathToFile,
        dirTree: state.terminal.dirTree
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Vim);