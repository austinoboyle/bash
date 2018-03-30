import React from 'react';
import ConnectedVimEditor, {VimEditor, Vim} from './VimEditor';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import AceEditor from 'react-ace';

const mockStore = configureMockStore([thunk]);
describe('VimEditor', () => {
    let wrapper;
    let props;
    let defineExSpy;
    let onChangeSpy;
    let mountedWrapper;
    beforeEach(() => {
        props = {
            write: jest.fn(),
            quit: jest.fn(),
            filename: 'test.txt',
            initialText: 'test'
        };
        defineExSpy = sinon.spy(Vim, 'defineEx');
        onChangeSpy = sinon.spy(VimEditor.prototype, 'onChange');
        wrapper = shallow(<VimEditor {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Calls defineEx more than once', () => {
        expect(defineExSpy.callCount).toBeGreaterThan(1);
    });

    it('calls onChange', () => {
        wrapper.find(AceEditor).simulate('change');
        expect(onChangeSpy.callCount).toBe(1);
    })

    it('Handles getValue and setValue editor funcs', () => {
        const editor = {
            getValue: jest.fn(() => {
                return test;
            }),
            setValue: jest.fn()
        };
        wrapper.instance().editor = editor;
        wrapper.instance().setValue();
        expect(editor.setValue).toHaveBeenCalledTimes(1);
        expect(editor.getValue).toHaveBeenCalledTimes(0);        
        wrapper.instance().getValue();
        expect(editor.setValue).toHaveBeenCalledTimes(1);        
        expect(editor.getValue).toHaveBeenCalledTimes(1);
    })

    afterEach(() => {
        wrapper.unmount();
        defineExSpy.restore();
        onChangeSpy.restore();
    });
})

describe('Mounted VimEditor', () => {
    const props = {
        open: jest.fn(),
        quit: jest.fn(),
        filename: 'test.txt',
        initialText: 'test'
    };
    const wrapper = mount(<VimEditor {...props}/>);
    it('Renders', () => {
        expect(wrapper.length).toBe(1);
    })
    it('has vim ref set', () => {
        expect(wrapper.instance().vim).toBeTruthy();
    })
})
