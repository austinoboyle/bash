import React, {Component} from 'react';
import TerminalInput from './components/TerminalInput';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getOutputsAndEffects from './middleware/getOutputsAndEffects';
import {submitCommand} from './actions/terminalActions';
import { goToPath } from './util';

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
            commandHistory: [''],
            historyIndex: 0
        };
    }

    componentDidMount(){
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
        const currentText = e.target.value;
        const words = currentText.split(/\s+/);
        const currentWord = words[words.length - 1]; //TODO make this robust
        if (currentWord.length < 1 || words.length < 2) {
            return;
        }
        const {path, dirTree} = {...this.props};
        let {commandHistory} = {...this.state};
        const currentDir = goToPath(dirTree, ['/'].concat(path));
        const reString = '^' + currentWord;
        for (let name of Object.keys(currentDir)){
            if (name.match(new RegExp(reString))){
                commandHistory[0] = currentText.replace(currentWord, name);
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
        let {commandHistory} = {...this.state};
        if (submittedCommand.length > 0) {
            commandHistory.unshift('');
        } else {
            commandHistory[0] = '';
        }
        this.props.submitCommand(submittedCommand, path, dirTree, user);
        this.setState({
            commandHistory: commandHistory,
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

    handleClear(){
        let {commandHistory} = {...this.state};
        commandHistory[0] = 'clear';
        commandHistory.unshift('');
        this.setState({
            outputs: [],
            commandHistory,
            historyIndex: 0
        });
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
        const {commandHistory, historyIndex, text} = this.state;
        return (
            <div className = "terminal" >
                {outputs.length > 0  && <div className="commandHistory">{outputs}</div>}

                <TerminalInput 
                    handleChange={(e) => this.handleChange(e)}
                    handleKeyDown={(e) => this.handleKeyDown(e)}
                    path={this.props.path}
                    user={this.props.user}
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
        outputs: state.terminal.outputs
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitCommand
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);