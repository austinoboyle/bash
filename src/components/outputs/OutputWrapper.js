import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TerminalInput from '../TerminalInput';

class OutputWrapper extends Component {
    render() {
        const {path, user, text, currentDirTree, children} = this.props;
        console.log("PATH IN OUTPUTWRAPPER", path);
        return (
            <div className="outputWrapper">
                <TerminalInput
                    path={this.props.path}
                    user={this.props.user}
                    isReadOnly={true}
                    value={text}
                />
                <div className="output">
                    {[...children]}
                </div>
            </div>
        );
    }
}

export default OutputWrapper;