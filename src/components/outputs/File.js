import React from 'react';

const File = ({name, type}) => {
    return <div className={`file ${type}`}>{name}</div>;
};

export default File;