export function parseCommandText(text){
    text = text.trim();
    const command = text.split(/\s+/g)[0];
    const args = text.split(/\s+/g).slice(1);
    const kwflags = args
        //Must contain leading double dash
        .filter(arg => new RegExp('^-{2}').test(arg))
        // Remove leading double dash
        .map(arg => arg.replace(/^--/, ""));

    const flags = args
        .filter(arg => new RegExp('^-{1}[^-]').test(arg))
        // Remove leading dashes
        .map(arg => arg.replace(/^-/, ""))
        // Turn into array of single flags
        .reduce((accum, flagString) => accum.concat(flagString.split('')), [])
        // Only unique elements
        .reduce((accum, flag) => accum.includes(flag) ? accum : accum.concat([flag]), []);

    const dirStrings = args
        .filter(arg => new RegExp('^[^-]+').test(arg))
        .map(arg => arg.replace(/\/$/, ""));
    console.log('TEXT:', text);
    console.log(command, args, kwflags,flags, dirStrings);
    return {
        command,
        kwflags,
        flags,
        dirStrings
    };
}

export function validateDir(dirTree, path, dirStrings){
    console.log('VALIDATING dirStrings', dirTree, path, dirStrings);
    
    for (let dir of ['/'].concat(path)) {
        dirTree = dirTree[dir];
        if (dirTree === null || dirTree === undefined) {
            console.log('NO SUCH DIR');
            
            return false;
        }
    }
    return true;
}


/**
 * 
 * 
 * @export
 * @param {Object} dirTree Entire directory structure
 * @param {Array<String>} path array of path
 * @returns undefined if the path is invalid, String if the path leads to a file,
 * object if the path leads to a directory.
 */
export function goToPath(dirTree, path){
    let dirTreeCopy = {...dirTree};
    const parsedPath = parsePath(path);

    for (let dir of parsedPath) {
        dirTreeCopy = dirTreeCopy[dir];
        if (dirTreeCopy === undefined) {
            return undefined;
        }
    }
    return dirTreeCopy;
}

export function parsePath(pathArray) {
    return pathArray.reduce((accum, dir) => {
        switch(dir) {
            case '.':
                return accum;
            case '..':
                return accum.slice(0,accum.length - 1);
            default:
                return accum.concat([dir]);
        }
    }, []);
}