import React, {Component} from 'react';

const TerminalInput = ({path, user, isReadOnly}) => (
    <div className="terminalInput">
        <div className="computer">{`${user}@austinoboyle.com`}</div>
        <div>:</div>
        <div className="path">{path.join("/")}</div>
        <div className="test">$</div>
        <input className="command" readOnly={isReadOnly}/>
    </div>
);

export default TerminalInput;