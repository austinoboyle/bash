import store from '../store';

export function test(){
    store.dispatch({
        type: 'CHANGE_DIR',
        payload: ['projects']
    });
};

export function terminalCommand() {
    return {
        type: 'COMMAND'
    };
};

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