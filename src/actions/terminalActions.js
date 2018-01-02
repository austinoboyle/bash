import React from 'react';
import store from '../store';
import getOutputsAndEffects from '../middleware/getOutputsAndEffects';
import OutputWrapper from '../components/outputs/OutputWrapper';

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
                <OutputWrapper text={text} user={user} path={path}>
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

export function execute(url) {
    return function(dispatch) {
        dispatch({
            type: 'EXECUTE'
        });
        window.open('https://www.austinoboyle.com' + url, '_blank');
    };
}