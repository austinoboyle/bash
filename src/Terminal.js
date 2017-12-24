import React, {Component} from 'react';
import logo from './logo.svg';
import TerminalInput from './components/TerminalInput';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getOutputsAndEffects from './middleware/getOutputsAndEffects';
import OutputWrapper from './components/outputs/OutputWrapper';
import {test} from './actions/terminalActions';

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

    componentDidMount(){
    }

    handleTimeTravel(e, direction) {
        e.preventDefault();
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
                historyIndex: historyIndex,
            });
        }
        // console.log("TODO: TIME TRAVEL");
    }

    handleAutoComplete(e){
        e.preventDefault(); //prevent tab from moving you around screen
        // console.log("TODO: AUTOCOMPLETE");
    }

    handleSubmit(e) {
        e.preventDefault();
        // console.log("TODO: SUBMIT");
        const submittedCommand = e.target.value;
        const {path, dirTree, user} = {...this.props};
        const {commandHistory, historyIndex} = {...this.state};
        getOutputsAndEffects(submittedCommand, path, dirTree);
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