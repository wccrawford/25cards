import React from 'react';
import ReactDOM from 'react-dom';

import Main from './js/Main.jsx';

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

ReactDOM.render(
    <Main />,
    document.getElementById('wrapper')
);
