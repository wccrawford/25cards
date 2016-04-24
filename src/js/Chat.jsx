import React from 'react';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('message', (message) => {
            this.addMessage(message);
        });
        this.socket.on('news', this.logNews.bind(this));
    }
    
    logNews(news) {
        console.log(news);
    }

    addMessage(message) {
        var messages = this.state.messages;
        messages.push(message);
        
        this.setState({
            messages: messages
        });
    }

    onUsernameKeyDown(evt) {
        if(evt.keyCode == 13) {
            // console.log('enter', this.refs.chatMessage.value);
            this.socket.emit('setName', this.refs.username.value, function(oldName, newName) {
                console.log('server responded to rename with: ', oldName, newName);
            });
            // this.refs.chatMessage.value = '';
        }
    }
    onChatKeyDown(evt) {
        if(evt.keyCode == 13) {
            // console.log('enter', this.refs.chatMessage.value);
            this.socket.emit('message', this.refs.chatMessage.value);
            this.refs.chatMessage.value = '';
        }
    }
    
    render() {
        var messages = this.state.messages.map((message) => {
            return (
                <div>{message}</div>
            )
        });
        return (
            <div>
                <label for="username">Name</label><input id="username" onKeyDown={this.onUsernameKeyDown.bind(this)} ref="username"/>
                <label for="message">Message: </label><input id="message" onKeyDown={this.onChatKeyDown.bind(this)} ref="chatMessage"/>
                <div id="chat">{messages}</div>
            </div>
        );
    }
}