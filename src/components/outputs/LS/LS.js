import React from 'react';
import File from '../File/File';

import styles from './LS.scss';

const LS = ({dirForCommand, flags}) => {
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

export default LS;