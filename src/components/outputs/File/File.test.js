import React from 'react';
import File from './File';
import {shallow} from 'enzyme';

describe('File', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            type: 'File',
            name: 'Name'
        };
        wrapper = shallow(<File {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Has the correct name', () => {
        expect(wrapper.text()).toBe(props.name);
    })

    afterEach(() => {
        wrapper.unmount();
    });
})
