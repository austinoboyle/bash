export function terminalCommand() {
    return {
        type: 'COMMAND'
    };
};

export function changeDir(newDir) {
    return {
        type: 'CHANGE_DIR',
        payload: newDir
    }
}