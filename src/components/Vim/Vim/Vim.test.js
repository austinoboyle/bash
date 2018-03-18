import React from 'react';
import ConnectedVim, {Vim} from './Vim';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([thunk]);

describe('Vim', () => {
    let wrapper;
    let props;
    let submitCommandSpy;
    beforeEach(() => {
        props = {
            terminalPath: ['/'],
            relativepathToFile: ['home', 'test.txt'],
            dirTree: {
                '/': {
                    'home' : {
                        'test.txt': 'test'
                    }
                }
            }
        };
        submitCommandSpy = sinon.spy(Vim.prototype, 'submitCommand');
        wrapper = shallow(<Vim {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Correctly generates initial text for the file', () => {
        expect(wrapper.state().initialText).toBe('test');
    })

    it('Calls submitCommand from VimEditor props', () => {
        wrapper.find('Connect(VimEditor)').props().submitCommand('Test');
        expect(submitCommandSpy.calledWith('Test')).toBe(true);
    })
    afterEach(() => {
        wrapper.unmount();
        submitCommandSpy.restore();
    });
})

describe('Connected Vim', () => {
    let store = mockStore({
        terminal: {
            path: ['/'],
            vim: {
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
    const wrapper = shallow(<ConnectedVim store={store}/>);
    it('Renders', () => {
        expect(wrapper.length).toBe(1);
    })
})
