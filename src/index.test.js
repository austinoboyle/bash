import React from 'react';
import ReactDOM from 'react-dom';
import {app} from './index';

it('renders without crashing', () => {
    ReactDOM.render(app, <div></div>);
});