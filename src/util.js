import { PROFILE } from './constants';
import * as _ from 'lodash';

export function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function getFileExtension(filename) {
    const splitFileName = filename.split('.');
    return splitFileName[splitFileName.length - 1].toLowerCase();
}

/**
 * Get the ace editor language for a filename
 *
 * @export
 * @param {String} filename
 * @returns {String} aceeditor file type
 */
export function getLanguageFromFilename(filename) {
    const mapExtensionToFiletype = {
        js: 'javascript',
        jsx: 'jsx',
        py: 'python',
        markdown: 'markdown',
        md: 'markdown',
        html: 'html',
        rb: 'ruby',
        java: 'java',
        xml: 'xml',
        css: 'css',
        scss: 'sass',
        sass: 'sass',
        txt: 'text'
    };
    const ext = getFileExtension(filename);
    const filetype = mapExtensionToFiletype[ext];
    return filetype !== undefined ? filetype : 'text';
}

/**
 * Get property names of an object that match a regex criteria
 *
 * @export
 * @param {object} obj the searched object
 * @param {string} criteria stringified regex criteria
 * @returns
 */
export function getMatchingPropertyNames(obj, criteria) {
    const re = new RegExp(criteria);
    return Object.keys(obj).filter(key => {
        return re.test(key);
    });
}

/**
 * Take a dirTree, and return the directory/file that the path parameter leads to
 *
 * @export
 * @param {Object} dirTree Entire directory structure
 * @param {Array<String>} path unparsed array of path (will be parsed)
 * @returns undefined if the path is invalid, String if the path leads to a file,
 * object if the path leads to a directory.
 */
export function goToPath(dirTree, path) {
    return _.cloneDeep(_.get(dirTree, parsePath(path), undefined));
}

/**
 * Check if a path leads to a directory
 *
 * @export
 * @param {Object} dirTree current directory tree
 * @param {Array} path array of desired path
 * @returns
 */
export function isDirectory(dirTree, path) {
    return typeof goToPath(dirTree, path) === 'object';
}

/**
 * Check if a path leads to a file
 *
 * @export
 * @param {Object} dirTree current directory tree
 * @param {Array} path array of desired path
 * @returns
 */
export function isFile(dirTree, path) {
    return typeof goToPath(dirTree, path) === 'string';
}

/**
 * Check if a path leads to a file or directory
 *
 * @export
 * @param {Object} dirTree current directory tree
 * @param {Array} path array of desired path
 * @returns
 */
export function isFileOrDirectory(dirTree, path) {
    const type = typeof goToPath(dirTree, path);
    return type === 'string' || type === 'object';
}

/**
 * Check if a url is relative
 *
 * @export
 * @param {String} url
 * @returns true if url is relative, false otherwise
 */
export function isRelativeURL(url) {
    return url.indexOf('https://') === -1 && url.indexOf('http://') === -1;
}

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
export function parseCommandText(text) {
    text = text.trim();
    const command = text.split(/\s+/g)[0];
    // const quotesRegex = /(['"]).*$1/g;
    const args = text.split(/\s+/g).slice(1);
    const kwflags = args
        //Must contain leading double dash
        .filter(arg => new RegExp('^-{2}[^-]').test(arg))
        // Remove leading double dash
        .map(arg => arg.replace(/^--/, ''))
        .reduce(
            (accum, flag) =>
                accum.includes(flag) ? accum : accum.concat([flag]),
            []
        );

    const flags = args
        .filter(arg => new RegExp('^-{1}[^-]').test(arg))
        // Remove leading dashes
        .map(arg => arg.replace(/^-/, ''))
        // Turn into array of single flags
        .reduce((accum, flagString) => accum.concat(flagString.split('')), [])
        // Only unique elements
        .reduce(
            (accum, flag) =>
                accum.includes(flag) ? accum : accum.concat([flag]),
            []
        );

    const dirStrings = args
        .filter(arg => new RegExp('^[^-]+').test(arg))
        .map(arg => arg.replace(/(.+)\/$/, '$1'));
    return {
        command,
        args,
        kwflags,
        flags,
        dirStrings
    };
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
        switch (dir) {
            case '.':
                return accum;
            case '..':
                return accum.length > 1
                    ? accum.slice(0, accum.length - 1)
                    : accum;
            // Absolute path given from root
            case '/':
                return ['/'];
            case '~':
                return PROFILE.HOME_DIR_ARR;
            default:
                return accum.concat([dir]);
        }
    }, []);
}

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
    if (pathString[0] === '/') {
        isAbsolutePath = true;
        pathString = pathString.slice(1);
    } else if (pathString[0] === '~') {
        pathArray = PROFILE.HOME_DIR_ARR;
        pathString = pathString.slice(1);
    }
    if (isAbsolutePath) {
        pathArray.unshift('/');
    }

    return pathArray
        .concat(pathString.split('/'))
        .filter(dir => dir.length > 0);
}

export function sharedStartOfElements(array) {
    var A = array.concat().sort(),
        a1 = A[0],
        a2 = A[A.length - 1],
        L = a1.length,
        i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
    return a1.substring(0, i);
}
