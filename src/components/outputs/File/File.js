import React from 'react';
import styles from './File.scss';

const File = ({name, type}) => {
    return <div className={`${styles[type]}`}>{name}</div>;
};

export default File;