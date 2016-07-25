import React from 'react';

import Card from './Card.jsx';

import './style.css';

export default class Viewer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            cards: []
        };
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('setCards', (message) => {
            console.log(message);
            this.setState({
                id: message.id,
                cards: message.cards
            })
        });
    }

    setShow(index, show) {
        // let cards = this.state.cards;
        // cards[index].show = show;
        // this.setState({
        //     cards: cards
        // });
    }

    render() {
        let cards = this.state.cards.map((card, index) => {
            return (
                <div style={{display:'flex',width:'20%',height:'20%','text-align':'center'}}>
                    <Card word={card.word} type={card.type} show={card.show} setShow={this.setShow.bind(this)} index={index}></Card>
                </div>
            );
        });

        return (
            <div id="viewer" style={{display:'flex','flex-wrap':'wrap'}}>
                {cards}
            </div>
        );
    }
}