import * as ta from './terminalActions';

describe('cd', () => {
    it('works', () => {
        expect(ta.cd('test')).toEqual({
            type: 'CHANGE_DIR',
            payload: 'test'
        })
    })
});

describe('clear', () => {
    it('works', () => {
        expect(ta.clear()).toEqual({type: 'CLEAR'});
    })
})

describe('copy', () => {
    it('works', () => {
        const source = 'source';
        const dest = 'dest';
        expect(ta.copy(source, dest)).toEqual({
            type: "COPY",
            payload: {source, dest}
        });
    })
})

describe('execute', () => {
    let dispatch;
    beforeEach(() => {
        global.open = jest.fn()
        dispatch = jest.fn();
    })
    it('Dispatches EXECUTE', () => {
        ta.execute('/test')(dispatch);
        expect(dispatch).toHaveBeenCalledWith({
            type: "EXECUTE"
        })
    })
    it('Calls window.open for both relative and abs urls', () => {
        const relURL = '/test';
        const absURL = 'https://www.google.ca';
        ta.execute(relURL)(dispatch);
        ta.execute(absURL)(dispatch);
        expect(global.open)
            .toHaveBeenCalledWith('https://www.austinoboyle.com' + relURL, '_blank');
        expect(global.open).toHaveBeenCalledWith(absURL, '_blank');
    })
})

describe('mkdir', () => {
    it('works', () => {
        const path = 'path';
        const newDir = 'newDir';
        expect(ta.mkdir(path, newDir)).toEqual({
            type: "MAKE_DIRECTORY",
            payload: {path, newDir}
        });
    })
})

describe('move', () => {
    it('works', () => {
        const source = 'source';
        const dest = 'dest';
        expect(ta.move(source, dest)).toEqual({
            type: "MOVE",
            payload: {source, dest}
        });
    })
})

describe('rename', () => {
    it('parses source & dest into correct dir, prev and next props', () => {
        const source = ['/', 'test', 'hello'];
        const dest = ['/', 'test', 'goodbye'];
        expect(ta.rename(source, dest)).toEqual({
            type: "RENAME",
            payload: {
                dir: source.slice(0, source.length - 1),
                prev: source[source.length - 1],
                next: dest[dest.length - 1]
            }
        });
    })
})

describe('rm', () => {
    it('works', () => {
        const path = ['path']
        const file = 'file'
        expect(ta.rm(path, file)).toEqual({
            type: "REMOVE",
            payload: {path, file}
        });
    })
})

describe('touch', () => {
    it('Works', () => {
        const path = ['path']
        const newFile = 'newFile';
        expect(ta.touch(path, newFile)).toEqual({
            type: 'TOUCH',
            payload: {path, newFile}
        })
    })
})