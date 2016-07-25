import React from 'react';

export default class Main extends React.Component {
    // constructor(props) {
    //     super(props);
    //
        // this.state = {
        //     cards: [],
        //     cardsFlipped: []
        // };
    // }

    componentDidMount() {
        console.log('mount');
        this.socket = io();
        this.socket.on('startGame', (message) => {
            console.log(message);
            // document.location.href = document.location.origin + '/master/' + message.game_id;
        });
    }

    handleStartGameClick() {
        this.socket.emit('createGame');
    }

    render() {
        return (
            <div id="main">
                <div>
                    <label>Game ID</label><input type="text" name="gameid"/><button name="joingame">Join Game</button>
                </div>
                <div>
                    <button name="creategame" onClick={this.handleStartGameClick.bind(this)}>Create Game</button>
                </div>
            </div>
        );
    }
}