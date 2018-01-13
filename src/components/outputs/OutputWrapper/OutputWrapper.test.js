import React from 'react';
import OutputWrapper from './OutputWrapper';
import {shallow} from 'enzyme';

describe('OutputWrapper', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            path: [],
            user: 'Test',
            text: 'Test',
            children: ['Test', 'Test']
        };
        wrapper = shallow(<OutputWrapper {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Renders correct number of children', () => {
        expect(wrapper.find('.output').props().children.length).toBe(props.children.length);
    })

    afterEach(() => {
        wrapper.unmount();
    });
})
