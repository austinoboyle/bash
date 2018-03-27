import React, {Component} from 'react';
import TerminalInput from '../TerminalInput/TerminalInput';
import {connect} from 'react-redux';
import {submitCommand} from '../../actions/terminalActions';
import { goToPath, pathStringToArray, getMatchingPropertyNames, sharedStartOfElements } from '../../util';
import {KEYS, DIRECTIONS} from '../../constants';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import {isEqual} from 'lodash';


export class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commandHistory: [''].concat(props.commandHistory),
            historyIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.commandHistory, this.props.commandHistory)){
            this.setState({commandHistory: [''].concat(nextProps.commandHistory)});            
        }
    }

    handleTimeTravel(e, direction) {
        e.preventDefault();
        let {historyIndex, commandHistory} = {...this.state};
        if(direction === DIRECTIONS.FORWARD) {
            historyIndex -= 1
        } else {
            historyIndex += 1;
        }
        if (historyIndex >= 0 && historyIndex < commandHistory.length) {
            this.setState({
                historyIndex: historyIndex,
            });
        }
    }

    handleAutoComplete(e){
        e.preventDefault(); //prevent tab from moving you around screen
        const commandText = e.target.value.trim();
        const {path, dirTree} = {...this.props};
        let {commandHistory} = {...this.state};

        let currentWord = commandText.replace(/.*\s+([^\s]+)$/, '$1');
        let dirsInCurrentCommand = pathStringToArray(currentWord);
        if (currentWord[currentWord.length - 1] === '/'){
            dirsInCurrentCommand.push('');          
        }
        currentWord = dirsInCurrentCommand[dirsInCurrentCommand.length - 1];
        dirsInCurrentCommand = dirsInCurrentCommand.slice(0, dirsInCurrentCommand.length - 1);
        const currentDir = goToPath(dirTree, path.concat(dirsInCurrentCommand));

        const matchingProperties = getMatchingPropertyNames(currentDir, '^' + currentWord);
        if (matchingProperties.length === 0) {
            return;
        } 
        const match = sharedStartOfElements(matchingProperties);
        commandHistory[0] = commandText.replace(new RegExp(`(^|[ /])${currentWord}$`), '$1' + match);
        if (typeof currentDir[match] === 'object') {
            commandHistory[0] += '/';
        }
        this.setState({
            commandHistory,
            historyIndex: 0
        });
        return;
    }

    handleSubmit(e) {
        e.preventDefault();
        const submittedCommand = e.target.value;
        const {path, dirTree, user} = {...this.props};
        this.props.submitCommand(submittedCommand, path, dirTree, user);
        this.setState({
            historyIndex: 0
        });
    }

    handleKeyDown(e) {
        switch(e.keyCode) {
            case KEYS.ENTER:
                this.handleSubmit(e);
                return;
            case KEYS.TAB:
                this.handleAutoComplete(e);
                return;
            case KEYS.UPARROW:
                this.handleTimeTravel(e, DIRECTIONS.BACKWARD);
                return;
            case KEYS.DOWNARROW:
                this.handleTimeTravel(e, DIRECTIONS.FORWARD);
                return;
            default:
                return;
        }
    }

    handleChange(e) {
        let {commandHistory, historyIndex} = {...this.state};
        commandHistory[historyIndex] = e.target.value;
        this.setState({
            commandHistory: commandHistory
        });
    }

    render() {
        const {path, user, outputs} = this.props;
        const {commandHistory, historyIndex} = this.state;
        return (
            <div className = "terminal" >
                {outputs.length > 0  && <div className="commandHistory">{outputs}</div>}

                <TerminalInput 
                    handleChange={(e) => this.handleChange(e)}
                    handleKeyDown={(e) => this.handleKeyDown(e)}
                    path={path}
                    user={user}
                    isReadOnly={false}
                    value={commandHistory[historyIndex]}  
                />
            </div>
        );
    }
}

Terminal.propTypes = exact({
    path: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.string.isRequired,
    dirTree: PropTypes.object.isRequired,
    outputs: PropTypes.array.isRequired,
    commandHistory: PropTypes.arrayOf(PropTypes.string),
    submitCommand: PropTypes.func.isRequired,
})

function mapStateToProps(state) {
    return {
        path: state.terminal.path,
        user: state.terminal.user,
        dirTree: state.terminal.dirTree,
        outputs: state.terminal.outputs,
        commandHistory: state.terminal.commandHistory
    };
}

const actions = {
    submitCommand
};

export default connect(mapStateToProps, actions)(Terminal);