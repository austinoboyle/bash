import React from 'react';
import File from '../File/File';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import styles from './LS.scss';

const LS = ({dirForCommand}) => {
    return (
        <div className={styles.wrapper}>
            {   
                Object.keys(dirForCommand).map(name => {
                    const type = typeof dirForCommand[name] === 'object' ? 'dir' : 'file';
                    return <File type={type} name={name}/>;
                })
            }
        </div>
    )
};

LS.propTypes = exact({
    dirForCommand: PropTypes.object.isRequired
});

export default LS;