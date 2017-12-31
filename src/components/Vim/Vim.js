import React, {Component} from 'react';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { goToPath } from '../../util';

import VimEditor from './VimEditor';


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
        // eslint-disable-next-line
        const {terminalPath, pathToFile, dirTree} = {...this.props};
        const {initialText} = {...this.state};
        return (
            <div id="vim-wrapper">
                <VimEditor 
                    submitCommand={(e) => this.submitCommand(e)}
                    initialText={initialText}
                    filename={pathToFile[pathToFile.length - 1]} 
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