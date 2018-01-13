import React from 'react';
import styles from './File.scss';

import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

const File = ({name, type}) => {
    return <div className={`${styles[type]}`}>{name}</div>;
};

File.propTypes = exact({
    name: PropTypes.string,
    type: PropTypes.string
});

export default File;