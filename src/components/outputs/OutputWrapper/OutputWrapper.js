import React from 'react';
import TerminalInput from '../../TerminalInput/TerminalInput';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import styles from './OutputWrapper.scss';

const OutputWrapper = ({ path, user, text, children }) => (
    <div className="outputWrapper">
        <TerminalInput path={path} user={user} isReadOnly={true} value={text} />
        <div className={styles.output}>{[...children]}</div>
    </div>
);

OutputWrapper.propTypes = exact({
    path: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired
});

export default OutputWrapper;
