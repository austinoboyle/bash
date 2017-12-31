import React, {Component} from 'react';
import TerminalInput from './components/TerminalInput';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {submitCommand} from './actions/terminalActions';
import { goToPath, pathStringToArray, arraysAreEqual } from './util';

// Important Keys
const ENTER = 13;
const TAB = 9;
const UPARROW = 38;
const DOWNARROW = 40;

// Directions
const FORWARD = 1;
const BACKWARD = -1;
class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commandHistory: [''].concat(props.commandHistory),
            historyIndex: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!arraysAreEqual(nextProps.commandHistory, this.props.commandHistory)){
            this.setState({commandHistory: [''].concat(nextProps.commandHistory)});            
        }
    }

    handleTimeTravel(e, direction) {
        e.preventDefault();
        let {historyIndex, commandHistory} = {...this.state};
        switch(direction) {
            case FORWARD:
                historyIndex -=1;
                break;
            default:
                historyIndex += 1;
        }
        if (historyIndex >= 0 && historyIndex < commandHistory.length) {
            this.setState({
                historyIndex: historyIndex,
            });
        }
        // console.log("TODO: TIME TRAVEL");
    }

    handleAutoComplete(e){
        e.preventDefault(); //prevent tab from moving you around screen
        const currentText = e.target.value.trim();
        const {path, dirTree} = {...this.props};
        let {commandHistory} = {...this.state};

        const words = currentText.split(/\s+/);
        let currentWord = words[words.length - 1]; //TODO make this robust
        let dirsInCurrentCommand = pathStringToArray(currentWord);

        let currentDir = goToPath(dirTree, path);

        if (dirsInCurrentCommand.length > 1) {
            currentWord = dirsInCurrentCommand[dirsInCurrentCommand.length - 1];
            dirsInCurrentCommand = dirsInCurrentCommand.slice(0, dirsInCurrentCommand.length - 1);
            currentDir = goToPath(dirTree, path.concat(dirsInCurrentCommand));
        }

        if (currentWord.length < 1 || words.length < 2) {
            return;
        }

        const lastSpaceIndex = currentText.lastIndexOf(' ');
        let lastSlashIndex = currentText.lastIndexOf('/');
        let indexToSlice = lastSlashIndex > lastSpaceIndex ? lastSlashIndex + 1 : lastSpaceIndex + 1; //+1 for inclusive slice
        const reString = '^' + currentWord;
        for (let name of Object.keys(currentDir)){
            if (name.match(new RegExp(reString))){
                commandHistory[0] = currentText.slice(0, indexToSlice) + name;
                if (typeof currentDir[name] === 'object'){
                    commandHistory[0] += '/';
                }
                this.setState({
                    commandHistory,
                    historyIndex: 0
                });
                return;
            }
        }
        // console.log("TODO: AUTOCOMPLETE");
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log("TODO: SUBMIT");
        const submittedCommand = e.target.value;
        const {path, dirTree, user} = {...this.props};
        this.props.submitCommand(submittedCommand, path, dirTree, user);
        this.setState({
            historyIndex: 0
        });
    }

    handleKeyDown(e) {
        switch(e.keyCode) {
            case ENTER:
                this.handleSubmit(e);
                return;
            case TAB:
                this.handleAutoComplete(e);
                return;
            case UPARROW:
                this.handleTimeTravel(e, BACKWARD);
                return;
            case DOWNARROW:
                this.handleTimeTravel(e, FORWARD);
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

function mapStateToProps(state) {
    return {
        path: state.terminal.path,
        user: state.terminal.user,
        dirTree: state.terminal.dirTree,
        outputs: state.terminal.outputs,
        commandHistory: state.terminal.commandHistory
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitCommand
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);