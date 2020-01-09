import React from 'react';
import ReactDOM from 'react-dom';

import Home from './Home';

import './../../sass/app.scss';

import * as serviceWorker from './serviceWorker';

if (document.getElementById('root')) {
    ReactDOM.render(<Home />, document.getElementById('root'));
}

serviceWorker.unregister();
