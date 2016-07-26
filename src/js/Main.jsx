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
        this.socket = io();
        this.socket.on('startGame', (message) => {
            console.log(message);
            document.location.href = document.location.origin + '/master/' + message.game_id;
        });
    }

    handleStartGameClick() {
        this.socket.emit('createGame');
    }

    handleJoinGame() {
        document.location.href = document.location.origin + '/viewer/' + this.refs['gameid'].value;
    }

    render() {
        return (
            <div id="main">
                <div>
                    <label>Game ID</label><input type="text" name="gameid" ref="gameid" id="gameid"/><button name="joingame" onClick={this.handleJoinGame.bind(this)}>Join Game</button>
                </div>
                <div>
                    <button name="creategame" onClick={this.handleStartGameClick.bind(this)}>Create Game</button>
                </div>
            </div>
        );
    }
}