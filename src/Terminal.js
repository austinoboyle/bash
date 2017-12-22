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
            text: '',
            prevCommands: [],
            outputs: []
        };
    }

    componentDidUpdate(){
        console.log(this.state);
    }

    handleTimeTravel(e, direction) {
        console.log("TODO: TIME TRAVEL");
    }

    handleAutoComplete(e){
        e.preventDefault(); //prevent tab from moving you around screen
        console.log("TODO: AUTOCOMPLETE");
    }

    handleSubmit(e) {
        console.log("TODO: SUBMIT");
        e.preventDefault();
        let {text, prevCommands, outputs} = {...this.state};
        const {dirTree, path, user} = this.props;
        // const {command, flags, dir} = parseCommandString(text);
        if (this.state.text.length > 0) {
            prevCommands.push(text);
        }
        this.setState({
            prevCommands: prevCommands,
            outputs: outputs.concat([<OutputWrapper 
                text={text}
                currentDirTree={dirTree}
                path={path}
                user={user}
            />]),
            text: ''
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
            text: e.target.value
        });
    }

    render() {
        const {path, user} = this.props;
        const {prevCommands, outputs, text} = this.state;
        return (
            <div className = "terminal" >
                {outputs.length > 0  && <div className="prevCommands">{outputs}</div>}

                <TerminalInput 
                    handleChange={(e) => this.handleChange(e)}
                    handleKeyDown={(e) => this.handleKeyDown(e)}
                    path={this.props.path}
                    user={this.props.user}
                    isReadOnly={false}
                    value={text}  
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