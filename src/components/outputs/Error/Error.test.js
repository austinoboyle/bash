import React from 'react';
import Error from './Error';
import {shallow} from 'enzyme';

describe('Error', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            msg: 'Test'
        };
        wrapper = shallow(<Error {...props}/>);
    });
    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
        expect(wrapper.text()).toBe(props.msg);
    });
    afterEach(() => {
        wrapper.unmount();
    });
})
