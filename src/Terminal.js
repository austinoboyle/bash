import React, {Component} from 'react';
import logo from './logo.svg';
import TerminalInput from './components/TerminalInput';

class Terminal extends Component {
    render() {
        return ( 
            <div className = "terminal" >
                <TerminalInput path={["~"]} user={"austinoboyle"} isReadOnly={false}/>
            </div>
        );
    }
}

export default Terminal;