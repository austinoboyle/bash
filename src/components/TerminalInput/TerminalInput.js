import React from 'react';
import {pathArrayToString} from '../../util';
import {PROFILE} from '../../constants';

import styles from './TerminalInput.scss';

const TerminalInput = ({path, user, isReadOnly, handleChange, handleKeyDown, value}) => (
    <div className={styles.terminalInput}>
        <div className="computer">{`${user}@austinoboyle.com`}</div>
        <div>:</div>
        <div className="path">{pathArrayToString(path).replace(PROFILE.HOME_DIR_STRING, '~')}</div>
        <div className="test">$</div>
        <input
            spellCheck={false}
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