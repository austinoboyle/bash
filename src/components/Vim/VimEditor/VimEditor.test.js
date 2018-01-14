import React from 'react';
import ConnectedVimEditor, {VimEditor, Vim} from './VimEditor';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([thunk]);
describe('VimEditor', () => {
    let wrapper;
    let props;
    let defineExSpy;
    beforeEach(() => {
        props = {
            open: jest.fn(),
            write: jest.fn(),
            filename: 'test.txt'
        };
        defineExSpy = sinon.spy(Vim, 'defineEx');
        wrapper = shallow(<VimEditor {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Calls defineEx more than once', () => {
        expect(defineExSpy.callCount).toBeGreaterThan(1);
    });

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
    });
})

describe('Connected VimEditor', () => {
    let store = mockStore({
        terminal: {
            path: ['/'],
            VimEditor: {
                pathToFile: ['home', 'test.txt']
            },
            dirTree: {
                '/': {
                    'home' : {
                        'test.txt': 'test'
                    }
                }
            }
        }
    });
    const wrapper = shallow(<ConnectedVimEditor store={store}/>);
    it('Renders', () => {
        expect(wrapper.length).toBe(1);
    })
})
