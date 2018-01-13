import React from 'react';
import LS from './LS';
import {shallow} from 'enzyme';

describe('LS', () => {
    let wrapper;
    let props;
    beforeEach(() => {
        props = {
            dirForCommand: {
                file: 'file',
                dir: {},
                file2: 'file2'
            }
        };
        wrapper = shallow(<LS {...props}/>);
    });

    it('Renders without crashing', () => {
        expect(wrapper.length).toBe(1);
    });

    it('Renders correct number of dirs/files', () => {
        expect(wrapper.findWhere((n) => n.props().type === 'dir').length).toBe(1);
        expect(wrapper.findWhere((n) => n.props().type === 'file').length).toBe(2);
    });

    afterEach(() => {
        wrapper.unmount();
    });
})
