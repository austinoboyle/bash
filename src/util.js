export function parseCommandText(text){
    text = text.trim();
    const command = text.split(' ')[0];
    const flags = [];
    const dirs = [];
    return {
        command,
        flags,
        dirs
    };
}

export function validateDir(dirTree, path, dirs){
    for (let dir of path) {
        dirTree = dirTree[path];
        if (dirTree === null || dirTree === undefined) {
            return false;
        }
    }
    return true;
}