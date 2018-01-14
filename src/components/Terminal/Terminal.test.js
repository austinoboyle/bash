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
    // let wrapper;
    // let props;
    // beforeEach(() => {
    //     props = {
    //         path: ['/'],
    //         user: 'austinoboyle',
    //         dirTree: PropTypes.object.isRequired,
    //         outputs: PropTypes.array.isRequired,
    //         commandHistory: PropTypes.arrayOf(PropTypes.string),
    //         submitCommand: PropTypes.func.isRequired,
    //     }
    //     wrapper = shallow(<Terminal {...props}/>);
    // });
    // it('Renders without crashing', () => {
    //     expect(wrapper.length).toBe(1);
    //     expect(wrapper.text()).toBe(props.msg);
    // });
    // afterEach(() => {
    //     wrapper.unmount();
    // });
});

describe('Event Handlers on TerminalInput', () => {
    let wrapper;
    let props;
    let spy;
    beforeEach(() => {
        props = {
            path: ['/'],
            user: 'austinoboyle',
            dirTree: {'/': {
                'home': {

                }
            }},
            outputs: [],
            commandHistory: ['ls'],
            submitCommand: jest.fn(),
        }
    })
    describe('handleChange', () => {
        beforeEach(() => {
            wrapper = shallow(<Terminal {...props}/>);
            spy = sinon.spy(Terminal.prototype, 'handleChange');
        });
        it('Changes state properly', () => {
            const e = {...defaultEvent};
            const prevHistory = wrapper.state().commandHistory;
            wrapper.find('TerminalInput').props().handleChange(e);
            expect(wrapper.state().commandHistory).toEqual([e.target.value].concat(prevHistory.slice(1)));
            expect(spy.calledOnce).toBe(true);
        })
        afterEach(() => {
            wrapper.unmount();
            spy.restore();
        })
    })

    describe('handleKeyDown', () => {
        beforeEach(() => {
            wrapper = shallow(<Terminal {...props}/>);
            spy = sinon.spy(Terminal.prototype, 'handleKeyDown');
        });
        it('ENTER', () => {
            const e = {...defaultEvent, keyCode: KEYS.ENTER};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            const submittedCommand = e.target.value;
            const {path, dirTree, user} = {...props};
            expect(props.submitCommand).toHaveBeenCalledWith(submittedCommand, path, dirTree, user);
        });
        it('TAB', () => {
            const e = {...defaultEvent, keyCode: KEYS.TAB};
            wrapper.find('TerminalInput').props().handleKeyDown(e);
            const submittedCommand = e.target.value;
            const {path, dirTree, user} = {...props};
            expect(props.submitCommand).toHaveBeenCalledWith(submittedCommand, path, dirTree, user);
        });
        it('UPARROW', () => {
            
        });
        it('DOWNARROW', () => {
            
        });
        it('DEFAULT', () => {
            
        })
        afterEach(() => {
            wrapper.unmount();
            spy.restore();
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
