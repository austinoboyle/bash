import React from 'react';
import store from '../store';
import getOutputsAndEffects from '../middleware/getOutputsAndEffects';
import OutputWrapper from '../components/outputs/OutputWrapper/OutputWrapper';
import {isRelativeURL} from '../util';

export function submitCommand(text, path, currentDirTree, user) {
    return function(dispatch) {
        let allOutputs = [];
        let finalCommandEffects = [];
        dispatch({
            type: 'SUBMIT_COMMAND',
            payload: text
        });
        const listOfCommands = text.split(/&&?/);
        for (var i = 0; i < listOfCommands.length; i++){
            const currentState = {...store.getState().terminal};
            const command = listOfCommands[i];
            const {outputs, effects} = getOutputsAndEffects(command, currentState.path, currentState.dirTree);
            if (i < listOfCommands.length - 1){
                for (let effect of effects) {
                    dispatch(effect);
                }
            } else {
                finalCommandEffects = effects;
            }
            allOutputs = allOutputs.concat(outputs); 
        }
        
        dispatch({
            type: 'NEW_OUTPUT',
            payload: (
                <OutputWrapper 
                    key={store.getState().terminal.outputs.length + 1} 
                    text={text}
                    user={user}
                    path={path}>
                    {allOutputs}
                </OutputWrapper>
            )
        });

        for (let effect of finalCommandEffects){
            dispatch(effect);
        }
        
    };
};

export function clear(){
    return {
        type: 'CLEAR'
    };
}

export function cd(newDir) {
    return {
        type: 'CHANGE_DIR',
        payload: newDir
    }
}

export function copy(source, dest) {
    return {
        type: "COPY",
        payload: {source, dest}
    }
}

export function mkdir(path, newDir) {
    return {
        type: 'MAKE_DIRECTORY',
        payload: {
            path,
            newDir
        }
    };
}

export function touch(path, newFile) {
    return {
        type: 'TOUCH',
        payload: {
            path,
            newFile
        }
    };
}

export function rm(path, file) {
    return {
        type: 'REMOVE',
        payload: {
            path,
            file
        }
    };
}

export function move(source, dest) {
    return {
        type: "MOVE",
        payload: {source, dest}
    }
};

export function rename(source, dest) {
    return {
        type: "RENAME",
        payload: {
            dir: source.slice(0, source.length - 1),
            prev: source[source.length - 1],
            next: dest[dest.length - 1]  
        }
    }
}

export function execute(url) {
    return function(dispatch) {
        dispatch({
            type: 'EXECUTE'
        });
        console.log("URL", url);
        if (isRelativeURL(url)) {
            console.log("RELATIVE")
            window.open('https://www.austinoboyle.com' + url, '_blank');
        }
        else {
            console.log("NOT RELATIVE");
            window.open(url, '_blank');
        }
    };
}