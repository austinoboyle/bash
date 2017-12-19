import React from 'react';
import ReactDOM from 'react-dom';
import Terminal from './Terminal';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Terminal />, document.getElementById('root'));
registerServiceWorker();
