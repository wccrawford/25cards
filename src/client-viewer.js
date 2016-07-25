import React from 'react';
import ReactDOM from 'react-dom';

import Viewer from './js/Viewer.jsx';

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

ReactDOM.render(
    <Viewer />,
    document.getElementById('wrapper')
);
