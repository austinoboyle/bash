import React from 'react';
import PlainText from './PlainText';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';

describe('PlainText', () => {
    let wrapper;
    let mountedWrapper
    let props;
    let resizeSpy;
    let setStateSpy;
    global.removeEveneListener = jest.fn();
    global.addEventListener = jest.fn();
    beforeEach(() => {
        props = {
            text: 'test'
        };
        resizeSpy = sinon.spy(PlainText.prototype, 'resize');
        setStateSpy = sinon.spy(PlainText.prototype, 'setState');
        // wrapper = shallow(<PlainText {...props}/>);
        mountedWrapper = mount(<PlainText {...props} />);
    });

    it('Renders without crashing', () => {
        expect(mountedWrapper.length).toBe(1);
        expect(mountedWrapper.state().rows).toBe(1);
    });

    it('Mounts correctly with call to resize', () => {
        expect(resizeSpy.callCount).toBe(1);
    });

    it('Creates a ref', () => {
        expect(typeof mountedWrapper.instance().textarea).toBe('object');
    });

    it('Does not resize if textarea ref null/undefined', () => {
        const initialNumCalls = setStateSpy.callCount;
        mountedWrapper.instance().resize();
        expect(setStateSpy.callCount).toBe(initialNumCalls + 1);
        mountedWrapper.instance().textarea = null;
        mountedWrapper.instance().resize();
        expect(setStateSpy.callCount).toBe(initialNumCalls + 1);        
    })

    afterEach(() => {
        // wrapper.unmount();
        mountedWrapper.unmount();
        resizeSpy.restore();
        setStateSpy.restore();
    });
})
