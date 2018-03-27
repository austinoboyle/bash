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
