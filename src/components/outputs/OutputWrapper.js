import React, {Component} from 'react';
import TerminalInput from '../TerminalInput';
import Error from './Error';
import {parseCommandText, validateDir} from '../../util';
import LS from './LS';
const KNOWN_COMMANDS = ['ls'];

class OutputWrapper extends Component {
    getOutputComponent(text) {
        const {command, flags, dirs} = parseCommandText(text);
        const {currentDirTree, path} = {...this.props};
        if (!KNOWN_COMMANDS.includes(command)) {
            return <Error msg={`${command}: command not found`}/>;
        } else if (!validateDir(currentDirTree, path, dirs)) {
            return <Error msg={`bash: ${command}: ${dirs.join('/')}: No such file or directory`}/>;
        }
        let dirForCommand = currentDirTree;
        for (let dir of ['/'].concat(path).concat(dirs)) {
            dirForCommand = dirForCommand[dir];
        }
        switch (command) {
            case 'ls':
                return <LS dirForCommand={dirForCommand} />;
            default:
                return <Error msg={`${command}: command not found`}/>;
        }
    }

    render() {
        const {path, user, text, currentDirTree} = this.props;
        return (
            <div className="outputWrapper">
                <TerminalInput
                    handleChange={null}
                    handleKeyDown={null}
                    path={this.props.path}
                    user={this.props.user}
                    isReadOnly={true}
                    value={text}
                />
                <div className="output">
                    {this.getOutputComponent(text)}
                </div>
            </div>
        )
    }
}

export default OutputWrapper;