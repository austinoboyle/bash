import React from 'react';
import ConnectedTerminal, {Terminal} from './Terminal';
import {shallow} from 'enzyme';
import store from '../../store';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {KEYS} from '../../constants';
import sinon from 'sinon';

const mockStore = configureMockStore([thunk]);
const defaultEvent = {
    stopPropagation: jest.fn(),
    preventDefault: jest.fn(),
    keyCode: KEYS.ENTER,
    target: {
        value: 'newValue'
    }
};

describe('Basic Functionality', () => {
    const props = {
        commandHistory: [],
        outputs: []
    };
    const wrapper = shallow(<Terminal {...props} />);
    it('conditionally renders commandHistory div', () => {
        expect(wrapper.find('.commandHistory').length).toBe(0);
        wrapper.setProps({outputs: ['test']});
        expect(wrapper.find('.commandHistory').length).toBe(1);
    })
})

describe('Lifecycle Methods', () => {
    let wrapper;
    const props = {
        commandHistory: [],
        outputs: []
    };
    let cwrpSpy;
    beforeEach(() => {
        cwrpSpy = sinon.spy(Terminal.prototype, 'componentWillReceiveProps');
        wrapper = shallow(<Terminal {...props} />);
    })
    it('ComponentWillReceiveProps updates commandHistory in state', () => {
        expect(wrapper.state().commandHistory.length).toBe(1);
        wrapper.setProps({commandHistory: ['test']})
        expect(wrapper.state().commandHistory.length).toBe(2);
        expect(cwrpSpy.callCount).toBe(1);
    })
    afterEach(() => {
        cwrpSpy.restore();
        wrapper.unmount();
    })
})

describe('Event Handlers on TerminalInput', () => {
    let wrapper, props;
    let keyDownSpy, timeTravelSpy, autoCompleteSpy, submitSpy, changeSpy;
    beforeEach(() => {
        props = {
            path: ['/'],
            user: 'austinoboyle',
            dirTree: {
                '/': {
                    'home': {
                        'austinoboyle': {},
                        'austin.txt': ''
                    },
                    'test.txt': 'test',
                    'test.md': '' 
                }
            },
            outputs: [],
            commandHistory: ['ls'],
            submitCommand: jest.fn(),
        }
    })
    describe('handleChange', () => {
        beforeEach(() => {
            wrapper = shallow(<Terminal {...props}/>);
            changeSpy = sinon.spy(Terminal.prototype, 'handleChange');
        });
        it('Changes state properly', () => {
            const e = {...defaultEvent};
            const prevHistory = wrapper.state().commandHistory;
            wrapper.find('TerminalInput').props().handleChange(e);
            expect(wrapper.state().commandHistory).toEqual([e.target.value].concat(prevHistory.slice(1)));
            expect(changeSpy.calledOnce).toBe(true);
        })
        afterEach(() => {
            wrapper.unmount();
            changeSpy.restore();
        })
    })

    describe('handleAutoComplete', () => {
        beforeEach(() => {
            wrapper = shallow(<Terminal {...props} />);
            autoCompleteSpy = sinon.spy(Terminal.prototype, 'handleAutoComplete');
        })

        it('handles trailing slash', () => {
            const e = {...defaultEvent, target: {value: 'home/'}};
            wrapper.instance().handleAutoComplete(e);
            expect(wrapper.state().commandHistory[0] === 'home/austin')
        })
        it('handles regular match', () => {
            const e = {...defaultEvent, target: {value: 'home/austin.t'}};
            wrapper.instance().handleAutoComplete(e);
            expect(wrapper.state().commandHistory[0]).toBe('home/austin.txt')
        })
        it('appends slash for matched directory', () => {
            const e = {...defaultEvent, target: {value: 'home'}};
            wrapper.instance().handleAutoComplete(e);
            expect(wrapper.state().commandHistory[0]).toBe('home/')
        })
        it('handles no match', () => {
            const e = {...defaultEvent, target: {value: 'asdf'}};
            wrapper.instance().handleAutoComplete(e);
            expect(wrapper.state().commandHistory[0]).toBe('')
        })

        afterEach(() => {
            wrapper.unmount();
            autoCompleteSpy.restore();
        })
    })

    describe('handleKeyDown', () => {

        beforeEach(() => {
            wrapper = shallow(<Terminal {...props}/>);
            keyDownSpy = sinon.spy(Terminal.prototype, 'handleKeyDown');
            timeTravelSpy = sinon.spy(Terminal.prototype, 'handleTimeTravel');
            autoCompleteSpy = sinon.spy(Terminal.prototype, 'handleAutoComplete');
            submitSpy = sinon.spy(Terminal.prototype, 'handleSubmit');
        });
        it('ENTER', () => {
            const e = {...defaultEvent, keyCode: KEYS.ENTER};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            expect(submitSpy.callCount).toBe(1);
        });
        it('TAB', () => {
            const e = {...defaultEvent, keyCode: KEYS.TAB, target: { value: 'cat te'}};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            expect(autoCompleteSpy.callCount).toBe(1);
        });
        it('UPARROW', () => {
            const e = {...defaultEvent, keyCode: KEYS.UPARROW};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            expect(timeTravelSpy.callCount).toBe(1);
        });
        it('DOWNARROW', () => {
            const e = {...defaultEvent, keyCode: KEYS.DOWNARROW};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            expect(timeTravelSpy.callCount).toBe(1);
        });
        it('DEFAULT', () => {
            const e = {...defaultEvent, keyCode: 12345};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            expect(timeTravelSpy.callCount).toBe(0);
        })
        afterEach(() => {
            keyDownSpy.restore();
            timeTravelSpy.restore();
            autoCompleteSpy.restore();
            submitSpy.restore();
            wrapper.unmount();
        })
    })
})

describe('Connected Terminal', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <ConnectedTerminal store={store} {...props}/>
            </Provider>    
        ).dive().dive();
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.find('.terminal').length).toBe(1);
    });

    afterEach(() => {
        wrapper.unmount();
    });
})
