import React from 'react';

import Card from './Card.jsx';

import './style.css';

import GoogleCast from './googlecast.js';

export default class Master extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            cards: []
        };

        this.googleCast = new GoogleCast();
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('setCards', (message) => {
            this.setState({
                id: message.id,
                cards: message.cards
            });
            this.googleCast.setViewerUrl(document.location.origin + '/viewer/' + message.id)
        });
    }

    setShow(index, show) {
        let cards = this.state.cards;
        cards[index].show = show;
        this.setState({
            cards: cards
        });
        this.socket.emit('setCards', cards);
    }

    render() {
        let cards = this.state.cards.map((card, index) => {
            return (
                <div key={'card'+index} style={{display:'flex',width:'20%',height:'20%','textAlign':'center'}}>
                    <Card word={card.word} type={card.type} show={card.show} setShow={this.setShow.bind(this)} index={index}></Card>
                </div>
            );
        });

        return (
            <div id="master" style={{display:'flex','flexWrap':'wrap'}}>
                {cards}
            </div>
        );
    }
}