import React, {Component} from 'react';
import logo from './logo.svg';
import TerminalInput from './components/TerminalInput';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {terminalCommand} from './actions/terminalActions';
import {parseCommandText} from './util';
import OutputWrapper from './components/outputs/OutputWrapper';

const ENTER = 13;
const TAB = 9;
const UPARROW = 38;
const DOWNARROW = 40;
const FORWARD = 1;
const BACKWARD = -1;
class Terminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commandHistory: [''],
            outputs: [],
            historyIndex: 0
        };
    }

    componentDidUpdate(){
        // console.log(this.state);
    }

    handleTimeTravel(e, direction) {
        let {historyIndex, commandHistory} = {...this.state};
        switch(direction) {
            case FORWARD:
                historyIndex -=1;
                break;
            case BACKWARD:
                historyIndex += 1;
                break;
        }
        if (historyIndex >= 0 && historyIndex < commandHistory.length) {
            this.setState({
                historyIndex: historyIndex
            });
        }
        // console.log("TODO: TIME TRAVEL");
    }

    handleAutoComplete(e){
        e.preventDefault(); //prevent tab from moving you around screen
        // console.log("TODO: AUTOCOMPLETE");
    }

    handleSubmit(e) {
        // console.log("TODO: SUBMIT");
        const submittedCommand = e.target.value;
        e.preventDefault();
        let {text, commandHistory, historyIndex, outputs} = {...this.state};
        const {dirTree, path, user} = this.props;
        if (submittedCommand.length > 0) {
            commandHistory[0] = submittedCommand;
            commandHistory.unshift('');
        } else {
            commandHistory[0] = '';
        }
        this.setState({
            commandHistory: commandHistory,
            outputs: outputs.concat([<OutputWrapper 
                text={submittedCommand}
                currentDirTree={dirTree}
                path={path}
                user={user}
            />]),
            historyIndex: 0
        });
    }

    handleKeyDown(e) {
        console.log("KEYDOWN");
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
        this.setState({
            commandHistory: [e.target.value].concat(this.state.commandHistory.slice(1))
        });
    }

    render() {
        const {path, user} = this.props;
        const {commandHistory, historyIndex, outputs, text} = this.state;
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
        dirTree: state.terminal.dirTree
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);