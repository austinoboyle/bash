import React from 'react';
import ConnectedApp, {App} from './App';
import {shallow} from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore([thunk]);

describe('App', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            isTerminalActive: true
        };
        wrapper = shallow(<App {...props}/>);
    });

    it('Conditionally renders Terminal and Vim', () => {
        expect(wrapper.find('Connect(Vim)').length).toBe(0);
        expect(wrapper.find('Connect(Terminal)').length).toBe(1);
        wrapper.setProps({
            isTerminalActive: false
        });
        expect(wrapper.find('Connect(Vim)').length).toBe(1);
        expect(wrapper.find('Connect(Terminal)').length).toBe(0);
    })
    afterEach(() => {
        wrapper.unmount();
    });
});

describe('Connected App', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        let store = mockStore({
            terminal: {
                isActive: false
            }
        });
        wrapper = shallow(
            <ConnectedApp store={store}/>
        )
    });
    it('Renders', () => {
        expect(wrapper.length).toBe(1);
    })
})
