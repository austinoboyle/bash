import * as u from './util.js';

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

// describe('File and Directory Checking', () => {
//     const dirTree = {
//         '/': {
//             'home': {
//                 'test.txt': 'test',
//                 'test.md': 'test'
//             }
//         }
//     };
//     it('isDirectory Works', () => {
//         expect(u.is())
//     })

//     it('isFile works', () => {

//     })

//     it('isDirectoryOrFile Works', () => {

//     })
// });