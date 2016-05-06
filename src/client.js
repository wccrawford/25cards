import React from 'react';
import ReactDOM from 'react-dom';

// import Plant from './plant';
// import Game from './game.jsx';
import Chat from './js/Chat.jsx';

// require("../scss/style.scss");

document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);


ReactDOM.render(
    <Chat />,
    document.getElementById('wrapper')
);
