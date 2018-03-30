import React from 'react';
import getOutputsAndEffects from './getOutputsAndEffects';
import { initialState } from '../reducers/terminalReducer';
import PlainText from '../components/outputs/PlainText/PlainText';
import Error from '../components/outputs/Error/Error';
import LS from '../components/outputs/LS/LS';
import { PROFILE } from '../constants';
import * as ta from '../actions/terminalActions';
import sinon from 'sinon';
import * as va from '../actions/vimActions';

const {
    dirTree: defaultDirTree,
    path: defaultPath,
    user: defaultUser
} = initialState;

const getWithDefaults = (
    text = '',
    path = defaultPath,
    currentDirTree = defaultDirTree,
    user = defaultUser
) => {
    return getOutputsAndEffects(text, path, currentDirTree, user);
};

describe('cat', () => {
    it('handles file', () => {
        const text = 'cat resume.md';
        const res = getWithDefaults(text);
        expect(res.outputs.length).toBe(1);
        expect(res.outputs[0].type === PlainText).toBe(true);
    });
    it('ouputs error for directory', () => {
        const text = 'cat projects';
        const { outputs } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('Is a directory');
    });
    it('outputs error for non-existent path', () => {
        const text = 'cat asdf';
        const { outputs } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    });
    it('handles no operand', () => {
        const text = 'cat';
        const { outputs } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('missing operand');
    });
    it('handles multiple items', () => {
        const text = 'cat resume.md projects';
        const { outputs } = getWithDefaults(text);
        expect(outputs.length).toBe(2);
        expect(outputs[0].type).toBe(PlainText);
        expect(outputs[1].type).toBe(Error);
    });
});

describe('cd', () => {
    let cdSpy;
    beforeEach(() => {
        cdSpy = sinon.spy(ta, 'cd');
    });
    it('throws error for more than 1 path given', () => {
        const text = 'cd projects ../austinoboyle';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('too many arguments');
    });
    it('Changes dir to ~ for empty path', () => {
        const text = 'cd';
        const { outputs, effects } = getWithDefaults(text);
        expect(cdSpy.callCount).toBe(1);
        expect(cdSpy.calledWith(PROFILE.HOME_DIR_ARR));
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
    });
    it('changes dir properly for valid dir', () => {
        const text = 'cd projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(effects.length).toBe(1);
        expect(outputs.length).toBe(0);
        expect(cdSpy.calledWith(defaultPath.concat(['projects'])));
    });
    it('Throws error for invalid dir', () => {
        const text = 'cd asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(effects.length).toBe(0);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('no such file');
    });
    it('throws error for file', () => {
        const text = 'cd resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(effects.length).toBe(0);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('Not a directory');
    });
    afterEach(() => {
        cdSpy.restore();
    });
});

describe('clear', () => {
    it('works (calls clear action)', () => {
        const clearSpy = sinon.spy(ta, 'clear');
        const text = 'clear';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(clearSpy.callCount).toBe(1);
        clearSpy.restore();
    });
});

describe('cp', () => {
    xit('TODO', () => {
        expect(false).toBe(true);
    });
});

describe('echo', () => {
    it('works with no args', () => {
        const text = 'echo';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].props.text).toBe('');
    });
    it('works with one arg', () => {
        const text = 'echo test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].props.text).toBe('test');
    });
    it('works with weirdly spaced args', () => {
        const text = 'echo test    test2   test3   ';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].props.text).toBe('test test2 test3');
    });
});

describe('ls', () => {
    it('outputs plaintext for files', () => {
        const text = 'ls resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(PlainText);
    });
    it('outputs LS for file', () => {
        const text = 'ls projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(LS);
    });
    it('Outputs Error for invalid path', () => {
        const text = 'ls asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
    });
    it('Works with multiple paths', () => {
        const text = 'ls resume.md projects asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(3);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(PlainText);
        expect(outputs[1].type).toBe(LS);
        expect(outputs[2].type).toBe(Error);
    });
});

describe('mv', () => {
    xit('TODO', () => {
        expect(false).toBe(true);
    });
});

describe('mkdir', () => {
    it('outputs error for no dirStrings', () => {
        const text = 'mkdir -r --test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('missing operand');
    });
    it('works for valid dir path', () => {
        const mkdirSpy = sinon.spy(ta, 'mkdir');
        const text = 'mkdir projects/test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(mkdirSpy.callCount).toBe(1);
        expect(
            mkdirSpy.calledWith(defaultPath.concat(['projects']), 'test')
        ).toBe(true);
    });
    it('outputs error for invalid dir path', () => {
        const text = 'mkdir asdf/asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    });
    it('outputs error for already-existing file/dir', () => {
        const text = 'mkdir resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('File exists');
    });
    it('works for multiple paths', () => {
        const text = 'mkdir resume/resume projects test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(2);
        expect(effects.length).toBe(1);
    });
});

describe('rm', () => {
    let rmSpy;
    beforeEach(() => {
        rmSpy = sinon.spy(ta, 'rm');
    });
    it('outputs error with no dirs given', () => {
        const text = 'rm --test -r';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('missing operand');
    });
    it('remove valid file', () => {
        const text = 'rm resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(rmSpy.calledOnce).toBe(true);
        expect(rmSpy.calledWith(defaultPath, 'resume.md')).toBe(true);
    });
    it('throws error removing dir with -r flag', () => {
        const text = 'rm projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('Is a directory');
    });
    it('removes dir with -r flag given', () => {
        const text = 'rm -r projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(rmSpy.calledOnce).toBe(true);
        expect(rmSpy.calledWith(defaultPath, 'projects')).toBe(true);
    });
    it('Outputs error with invalid path', () => {
        const text = 'rm -rf asdf/asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    });
    it('Works with multiple dirStrings', () => {
        const text = 'rm resume.md projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(1);
    });
    afterEach(() => {
        rmSpy.restore();
    });
});

describe('touch', () => {
    let touchSpy;
    beforeEach(() => {
        touchSpy = sinon.spy(ta, 'touch');
    });
    afterEach(() => {
        touchSpy.restore();
    });
    it('Outputs error with no dirStrings', () => {
        const text = 'touch --test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('missing operand');
    });
    it('makes valid file', () => {
        const text = 'touch test.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(touchSpy.calledOnce).toBe(true);
        expect(touchSpy.calledWith(defaultPath, 'test.md')).toBe(true);
    });
    it('Outputs error with invalid path', () => {
        const text = 'touch asdf/asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    });
    it('Works with multiple dirStrings', () => {
        const text = 'touch test.md asdf/asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(1);
    });
});

describe('vim', () => {
    it('outputs error for 0 or 2+ dirStrings', () => {
        const text = 'vim';
        const text2 = 'vim resume.md projects';
        const { outputs, effects } = getWithDefaults(text);
        const { outputs: outputs2, effects: effects2 } = getWithDefaults(text2);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs2.length).toBe(1);
        expect(effects2.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('handle exactly 1');
        expect(outputs2[0].type).toBe(Error);
        expect(outputs2[0].props.msg).toContain('handle exactly 1');
    });
    it('Outputs error for non-existent container dir', () => {
        const text = 'vim asdf/asdf';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('non-existent dirs');
    });
    it('works for valid file path', () => {
        const vimSpy = sinon.spy(va, 'initializeVim');
        const text = 'vim resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(vimSpy.calledOnce).toBe(true);
        expect(vimSpy.calledWith(['resume.md']));
        vimSpy.restore();
    });
    it('Outputs error for valid dir', () => {
        const text = 'vim projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain("can't handle dirs");
    });
    it('outputs error for valid container and non-existent file', () => {
        const text = 'vim test.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('handle undefined files');
    });
});

describe('default case (executables)', () => {
    it('throws command not found for non-executables', () => {
        const text = 'asdf asdf asdf --test';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('asdf: command not found');
    });
    it('executes valid .sh files', () => {
        const exeSpy = sinon.spy(ta, 'execute');
        const text = 'projects/blog.sh';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(0);
        expect(effects.length).toBe(1);
        expect(exeSpy.calledOnce).toBe(true);
        expect(exeSpy.calledWith('/blog')).toBe(true);
        exeSpy.restore();
    });
    it('returns plaintext for directories', () => {
        const text = './projects';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(PlainText);
        expect(outputs[0].props.text).toContain('Is a directory');
    });
    it('outputs error trying to execute non-executble file', () => {
        const text = './resume.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('not executable');
    });
    it('outputs error for invalid path', () => {
        const text = './asdf.md';
        const { outputs, effects } = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(effects.length).toBe(0);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    });
});
