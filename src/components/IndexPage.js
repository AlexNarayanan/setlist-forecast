'use strict';
import React from 'react';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { artist: '', response: '' };
        console.info('inside constructor index page');

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({ artist: event.target.value, response: this.state.response });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.info(this.state.artist);

        // Make xmlhttprequest
        const xmlhttp = new XMLHttpRequest(),
            _this = this;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                const response = JSON.parse(xmlhttp.responseText);
                if (xmlhttp.status === 200 && response.status === 'OK') {
                    _this.setState({ artist: '', response: response.artist });
                } else {
                    _this.setState({ artist: '', response: 'Sorry there has been an error' });
                }
            }
        };
        xmlhttp.open('POST', 'submit', true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send(`artist=${ this.state.artist }`);
    }

    render() {
        return (
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <label>
                        Artist Name:
                        <input type="text" name="artist" value={ this.state.artist } onChange={ this.handleChange }/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
                    <p>You have searched for: { this.state.response }</p>
                </div>
            </div>
        );
    }
}