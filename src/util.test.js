import * as u from './util.js';
import {PROFILE} from './constants';
const documentCookieMock = (function() {
    return 'test=1';
})();

describe('getCookie', () => {
    Object.defineProperty(document, 'cookie', {
        value: documentCookieMock
    });
    it ('Finds a cookie', () => {
        expect(u.getCookie('test')).toBe('1');
    })
    it('Returns null if cookie not present', () => {
        expect(u.getCookie('asdf')).toBe(null);
    })
})

describe('getLanguageFromFilename', () => {
    it('returns "text" for unknown filetypes', () => {
        expect(u.getLanguageFromFilename('test.asdf')).toBe('text');
    })
    it ('returns "javascript" for .js extensions', () => {
        expect(u.getLanguageFromFilename('test.test.js')).toBe('javascript');
describe('getMatchingPropertyNames', () => {
    const obj = {
        test: 'asdf',
        test2: 'asdf',
        asdf: 'asdf'
    };

    it('works', () => {
        expect(u.getMatchingPropertyNames(obj, '^t').length).toBe(2);
        expect(u.getMatchingPropertyNames(obj, '^a').length).toBe(1);
        expect(u.getMatchingPropertyNames(obj, '1').length).toBe(0);
    });
})

describe('goToPath', () => {
    const dirTree = {
        '/': {
            'home': {
                'test.txt': 'test',
                'test.md': 'test'
            }
        }
    };
    it('Returns undefined for unknown path', () => {
        expect(u.goToPath(dirTree, ['/', 'asdf'])).toBe(undefined);
    });

    it('returns deep copy of tree for valid path', () => {
        expect(u.goToPath(dirTree, ['/'])).toEqual(dirTree['/']);
        expect(u.goToPath(dirTree, ['']) === dirTree['/']).toBe(false);
    });
});

describe('File and Directory Checking', () => {
    const dirTree = {
        '/': {
            'home': {
                'test.txt': 'test',
                'test.md': 'test'
            }
        }
    };
    it('isDirectory Works', () => {
        expect(u.isDirectory(dirTree, ['/'])).toBe(true);
        expect(u.isDirectory(dirTree, ['asdf'])).toBe(false);
        expect(u.isDirectory(dirTree, ['/', 'home', 'test.txt'])).toBe(false);
    })

    it('isFile works', () => {
        expect(u.isFile(dirTree, ['/', 'home', 'test.txt'])).toBe(true);
        expect(u.isFile(dirTree, ['/'])).toBe(false);
        expect(u.isFile(dirTree, ['asdf'])).toBe(false);
    })

    it('isDirectoryOrFile Works', () => {
        expect(u.isFileOrDirectory(dirTree, ['/', 'home', 'test.txt'])).toBe(true);
        expect(u.isFileOrDirectory(dirTree, ['/'])).toBe(true);
        expect(u.isFileOrDirectory(dirTree, ['asdf'])).toBe(false);
    })
});

describe('isRelativeURL', () => {
    const relURL = '/test';
    const httpsURL = 'https://www.google.ca';
    const httpURL = 'http://www.google.ca';

    it('works', () => {
        expect(u.isRelativeURL(relURL)).toBe(true);
        expect(u.isRelativeURL(httpsURL)).toBe(false);
        expect(u.isRelativeURL(httpURL)).toBe(false);
    })
});

describe('parseCommandText', () => {
    it('handles multiple keyword flags', () => {
        expect(u.parseCommandText('test --flag --flag2').kwflags).toEqual(
            ['flag', 'flag2']
        );
    })
    it('handles staggerred flags and kwflags', () => {
        const command = 'test --kw1 -as --kw2 -df';
        expect(u.parseCommandText(command).flags).toEqual(['a', 's', 'd', 'f']);
        expect(u.parseCommandText(command).kwflags).toEqual(['kw1', 'kw2']);
    })
    it('Gets dirStrings correctly', () => {
        const command = 'test --kw1 test/test -as test';
        expect(u.parseCommandText(command).dirStrings).toEqual(['test/test', 'test']);
    })
    it('Handles duplicate flags, only listing them once', () => {
        const command = 'test --flag --flag -af -fa';
        expect(u.parseCommandText(command).flags).toEqual(['a', 'f']);
        expect(u.parseCommandText(command).kwflags).toEqual(['flag']);
    })
})

describe('parsePath', () => {
    it('handles ~', () => {
        const path = ['/', '..', '.', '~']
        expect(u.parsePath(path)).toEqual(PROFILE.HOME_DIR_ARR);
    })
    it('handles .. at root', () => {
        const path = ['/', '..', '..', '..', 'home'];
        expect(u.parsePath(path)).toEqual(['/', 'home']);
    })
    it('Handles .. past root', () => {
        const path = ['/', 'home', '..', 'home'];
        expect(u.parsePath(path)).toEqual(['/', 'home']);
    })
    it('Handles .', () => {
        const path = ['/', '.', 'home', '.', 'test']
        expect(u.parsePath(path)).toEqual(path.filter(el => el !== '.'));
    })
})

describe('pathArrayToString', () => {
    it('Returns empty string for empty array', () => {
        expect(u.pathArrayToString([])).toBe('');
    })
    it('Returns leading slash on absolute paths', () => {
        expect(u.pathArrayToString(['/', 'test'])).toBe('/test');
    });
    it('Returns no leading slash on relative paths', () => {
        expect(u.pathArrayToString(['test', '1'])).toBe('test/1');
    })
})

describe('pathStringToArray', () => {
    it('Handles absolute paths', () => {
        expect(u.pathStringToArray('/test/hello'))
            .toEqual(['/' ,'test', 'hello']);
    })
    it('Handles relative paths', () => {
        expect(u.pathStringToArray('test/hello/world'))
            .toEqual(['test', 'hello', 'world'])
    });
    it('Handles ~', () => {
        expect(u.pathStringToArray('~/test/hello'))
            .toEqual(PROFILE.HOME_DIR_ARR.concat(['test', 'hello']));
    })
})

describe('sharedStartOfElements', () => {
    it('Returns empty string for completely different elements', () => {
        const elements = ['asdf', 'asdf', 'a', 'b'];
        expect(u.sharedStartOfElements(elements)).toBe('');
    })
    it('Handles equal elements', () => {
        const elements = ['asdf', 'asdf', 'asdf'];
        expect(u.sharedStartOfElements(elements)).toBe('asdf');
    });
    it('Handles other cases', () => {
        const elements = ['asdf', 'asdf', 'asfd', 'asdfg'];
        expect(u.sharedStartOfElements(elements)).toBe('as');
    })
})