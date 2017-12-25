import React, {Component} from 'react';
import File from './File';

const LS = ({dirForCommand, flags}) => {
    console.log("NEW PROPS", dirForCommand);
    return (
        <div className="output-ls">
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