import React, { Component } from 'react';

import './Card.css';

class Card extends Component {
    constructor() {
        super();

        // this.state = {
        //     show: false
        // };
    }

    handleClick() {
        // this.setState({
        //     show: !this.state.show
        // });
        this.props.setShow(this.props.index, !this.props.show);
    }

    render() {
        var word = this.props.word;
        var classes = ['Card', this.props.type];
        if(this.props.show) {
            classes.push('show');
        }
        if(this.props.master) {
            classes.push('master');
        }

        return (
            <div className={classes.join(' ')} onClick={this.handleClick.bind(this)}>
                {word}
            </div>
        );
    }
}

export default Card;