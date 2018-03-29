import React from 'react';
import getOutputsAndEffects from './getOutputsAndEffects';
import {initialState} from '../reducers/terminalReducer';
import PlainText from '../components/outputs/PlainText/PlainText';
import Error from '../components/outputs/Error/Error';

const {
    dirTree: defaultDirTree,
    path: defaultPath,
    user: defaultUser
} = initialState;

const getWithDefaults = (
    text='',
    path=defaultPath,
    currentDirTree=defaultDirTree,
    user=defaultUser
) => {
    return getOutputsAndEffects(text, path, currentDirTree, user);
};

describe('cat', () => {
    it('handles file', () => {
        const text = 'cat resume.md';
        const res = getWithDefaults(text);
        expect(res.outputs.length).toBe(1);
        expect(res.outputs[0].type === PlainText).toBe(true);
    })
    it('ouputs error for directory', () => {
        const text = 'cat projects';
        const {outputs} = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('Is a directory');
    })
    it('outputs error for non-existent path', () => {
        const text = 'cat asdf';
        const {outputs} = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('No such file');
    })
    it('handles no operand', () => {
        const text = 'cat';
        const {outputs} = getWithDefaults(text);
        expect(outputs.length).toBe(1);
        expect(outputs[0].type).toBe(Error);
        expect(outputs[0].props.msg).toContain('missing operand');
    })
    it('handles multiple items', () => {
        const text = 'cat resume.md projects';
        const {outputs} = getWithDefaults(text);
        expect(outputs.length).toBe(2);
        expect(outputs[0].type).toBe(PlainText);
        expect(outputs[1].type).toBe(Error);
    })
})