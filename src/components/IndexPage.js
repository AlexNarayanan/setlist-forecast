'use strict';
import React from 'react';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        console.info('inside constructor');

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.info(this.state.value);
    }

    render() {
        return (
            <form method="post" action="/submit">
                <label>
                    Artist Name:
                    <input type="text" name="artist" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}