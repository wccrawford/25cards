import React from 'react';
import ReactDOM from 'react-dom';

import Master from './js/Master.jsx';

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

ReactDOM.render(
    <Master />,
    document.getElementById('wrapper')
);
