import React from 'react';
const TILDE_PATH = '/home/austinoboyle';
const TerminalInput = ({path, user, isReadOnly, handleChange, handleKeyDown, value}) => (
    <div className="terminalInput">
        <div className="computer">{`${user}@austinoboyle.com`}</div>
        <div>:</div>
        <div className="path">{('/' + path.join("/")).replace(TILDE_PATH, '~')}</div>
        <div className="test">$</div>
        <input
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="command"
            readOnly={isReadOnly}
            autoFocus={!isReadOnly}
            value={value}
        />
    </div>
);

export default TerminalInput;