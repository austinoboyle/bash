import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TerminalInput from '../TerminalInput';
import Error from './Error';
import {parseCommandText, validateDir, goToPath, parsePath} from '../../util';
import {changeDir} from '../../actions/terminalActions';
import LS from './LS';
import PlainText from './PlainText';
const KNOWN_COMMANDS = ['ls'];

class OutputWrapper extends Component {
    getOutputComponent(text) {
        let {command, kwflags, flags, dirStrings} = parseCommandText(text);
        let {currentDirTree, path} = {...this.props};
        
        let paths = [];
        if (dirStrings.length === 0) {
            paths = [path];
        } else {
            paths = dirStrings.map(dirString => {
                return path.concat(dirString.split('/'));
            });
        }
        console.log("PATHS", paths)
        switch (command) {
            case 'ls':
                return paths.map(path => {
                    console.log("PATH", path);
                    const fullPath = ['/'].concat(path);
                    console.log("FULLPATH", fullPath);
                    const dirForCommand = goToPath(currentDirTree, fullPath);
                    switch (typeof dirForCommand) {
                        case 'object':
                            return <LS dirForCommand={dirForCommand} />;
                        case 'string':
                            return <PlainText text={fullPath[fullPath.length - 1]}/>;
                        default:
                            return <Error msg={`${command}: cannot access '${path.join('/')}': No such file or directory`}/>;
                    }
                });
            case 'cd':
                if (paths.length > 1) {
                    return <Error msg={`${command}: too many arguments.`}/>;
                } else if (dirStrings.length === 0) {
                    this.props.changeDir(['home', 'austinoboyle']);
                    return null;
                } else {
                    const fullPath = ['/'].concat(paths[0]);
                    const dirForCommand = goToPath(currentDirTree, fullPath);
                    switch (typeof dirForCommand) {
                        case 'string':
                            return <Error msg={`bash: cd: ${fullPath[fullPath.length - 1]}: Not a directory.`}/>;
                        case 'undefined':
                            return <Error msg={`bash: cd: ${dirStrings[0]}: no such file or directory.`}/>;
                        case 'object':
                            this.props.changeDir(parsePath(paths[0]));
                            return null;
                    }
                }
                
                return null;
            default:
                return <Error msg={`${command}: command not found`}/>;
        }
    }

    render() {
        const {path, user, text, currentDirTree} = this.props;
        return (
            <div className="outputWrapper">
                <TerminalInput
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeDir
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(OutputWrapper);