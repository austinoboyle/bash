import React from 'react';
import TerminalInput from './TerminalInput';
import {shallow} from 'enzyme';

describe('TerminalInput', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            path: ['test'],
            user: 'austinoboyle',
            isReadOnly: false,
            handleChange: jest.fn(),
            handleKeyDown: jest.fn(),
            value: 'test'
        };
        wrapper = shallow(<TerminalInput {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it("Calls event handlers", () => {
        wrapper.find('input').simulate('change');
        expect(props.handleChange).toHaveBeenCalledTimes(1);
        expect(props.handleKeyDown).toHaveBeenCalledTimes(0);
        wrapper.find('input').simulate('keydown');
        expect(props.handleChange).toHaveBeenCalledTimes(1);
        expect(props.handleKeyDown).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        wrapper.unmount();
    });
})
