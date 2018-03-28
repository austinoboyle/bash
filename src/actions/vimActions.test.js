import * as va from './vimActions';

describe('changeMode', () => {
    it('works', () => {
        expect(va.changeMode()).toEqual({
            type: "CHANGE_MODE"
        })
    });
})

describe('initializeVim', () => {
    it('works', () => {
        const pathToFile = ['test'];
        expect(va.initializeVim(pathToFile)).toEqual({
            type: "INITIALIZE_VIM",
            payload: pathToFile
        });
    })
})

describe('quit', () => {
    it('works', () => {
        expect(va.quit()).toEqual({
            type: "QUIT_VIM"
        });
    })
})

describe('write', () => {
    it('works', () => {
        const text = 'test';
        expect(va.write(text)).toEqual({
            type: "WRITE",
            payload: text
        })
    })
})