import {PROFILE} from './constants';

/**
 * Parse a user's input text, return an object:
 *  {command, args, kwflags, flags, dirStrings }
 * 
 * @export
 * @param {any} text 
 * @returns {Object} contains 5 properties as follows:
 * - args: {Array<String>} array of ALL args
 * - command: {String}
 * - kwflags: {Array<String>} keyword flags (ie --long => ['long'])
 * - flags: {Array<Character> single character flags (ie -asdf => ['a', 's', 'd', 'f'])}
 * - dirStrings: {Array<String>} list of all directories given in command
 */
export function parseCommandText(text){
    text = text.trim();
    const command = text.split(/\s+/g)[0];
    // const quotesRegex = /(['"]).*$1/g;
    const args = text.split(/\s+/g).slice(1);
    const kwflags = args
        //Must contain leading double dash
        .filter(arg => new RegExp('^-{2}[^-]').test(arg))
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
        .map(arg => arg.replace(/(.+)\/$/, "$1"));
    console.log('TEXT:', text);
    console.log(command, args, kwflags,flags, dirStrings);
    return {
        command,
        args,
        kwflags,
        flags,
        dirStrings
    };
}

/**
 * Compare two arrays for strict equality (order matters)
 * 
 * @export
 * @param {any} a1 
 * @param {any} a2 
 * @returns {Boolean} true if arrays are identical, false otherwise
 */
export function arraysAreEqual(a1, a2){
    return a1.length === a2.length && a1.every((v,i)=> v === a2[i]);
}

/**
 * Convert a string path to a path array
 * 
 * @export
 * @param {String} pathString string path
 * @returns {Array<String>} unparsed path array
 */
export function pathStringToArray(pathString) {
    let pathArray = [];
    let isAbsolutePath = false;
    if (pathString[0] === '/'){
        isAbsolutePath = true;
        pathString = pathString.slice(1);
    } else if (pathString[0] === '~') {
        pathArray = PROFILE.HOME_DIR_ARR;
        pathString = pathString.slice(1);
    }
    if (isAbsolutePath) {
        pathArray.unshift('/');
    }
    
    return pathArray.concat(pathString.split("/")).filter(dir => dir.length > 0);
};

/**
 * Stringify a path array
 * 
 * @export
 * @param {String} pathArr path array
 * @returns {Array<String>} stringified path
 */
export function pathArrayToString(pathArr) {
    let stringifiedPath = '';
    if (pathArr.length < 1) {
        return stringifiedPath;
    } else if (pathArr[0] === '/') {
        stringifiedPath += '/';
        pathArr = pathArr.slice(1);
    }
    return stringifiedPath + pathArr.join('/');
};


/**
 * Take a dirTree, and return the directory/file that the path parameter leads to
 * 
 * @export
 * @param {Object} dirTree Entire directory structure
 * @param {Array<String>} path unparsed array of path (will be parsed)
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

/**
 * Parse a relative path array and return the parsed absolute path array
 * 
 * @export
 * @param {Array} pathArray Array of the path being parsed.  Can include relative
 * path elements like '.' '..' '/', and '~'
 * @returns parsed absolute path
 * @example parsePath(['/', 'home', 'austinoboyle', 'test', '/' 'home']) => ['/', 'home']
 */
export function parsePath(pathArray) {
    return pathArray.reduce((accum, dir) => {
        switch(dir) {
            case '.':
                return accum;
            case '..':
                return accum.length > 1 ? accum.slice(0,accum.length - 1) : accum;
            // Absolute path given from root
            case '/':
                return ['/'];
            case '~':
                return PROFILE.HOME_DIR_ARR;
            default:
                return accum.concat([dir]);
        }
    }, []);
};

export function getFileExtension(filename) {
    const splitFileName = filename.split('.');
    try {
        return splitFileName[splitFileName.length - 1].toLowerCase();
    } catch (e) {
        return null;
    }
}