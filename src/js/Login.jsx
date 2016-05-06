import React from 'react';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     messages: []
        // };
    }

    render() {
        // var messages = this.state.messages.map((message) => {
        //     return (
        //         <div>{message}</div>
        //     )
        // });
        return (
            <form method="POST" enctype="multipart/form-data">
                <label for="username">Name</label><input id="username" name="username" />
                <label for="password">Password</label><input type="password" id="password" name="password" />
                <button default="true" type="submit">Submit</button>
            </form>
        );
    }
}