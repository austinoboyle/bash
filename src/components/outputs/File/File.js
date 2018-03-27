import React from 'react';
import styles from './File.scss';

import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import composeClassName from 'classnames';
import {getFileExtension} from '../../../util';

const File = ({name, type}) => {
    const classes = composeClassName(styles[type], {
        [styles.exec]: getFileExtension(name) === 'sh'
    });
    return <div className={classes}>{name}</div>;
};

File.propTypes = exact({
    name: PropTypes.string,
    type: PropTypes.string
});

export default File;