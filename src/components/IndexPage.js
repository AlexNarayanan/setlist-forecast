'use strict';
import React from 'react';

export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            artist: '',
            isSending: false,
            response: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({
            artist: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            isSending: true
        });

        // Make xmlhttprequest to server
        const xmlhttp = new XMLHttpRequest(),
            _this = this;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                const response = JSON.parse(xmlhttp.responseText);
                if (xmlhttp.status === 200 && response.status === 'OK') {
                    _this.setState({
                        isSending: false,
                        response: response.id
                    });
                } else {
                    _this.setState({
                        isSending: false,
                        response: 'Sorry there has been an error'
                    });
                }
            }
        };
        xmlhttp.open('POST', 'submit', true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.send(`artistName=${ encodeURI(this.state.artist) }`);
    }

    render() {
        let sending;
        if (this.state.isSending) {
            sending = <div>
                <p>Sending...</p>
            </div>
        }
        return (
            <div>
                <form onSubmit={ this.handleSubmit }>
                    <label>
                        Artist Name:
                        <input type="text" name="artist" value={ this.state.artist } onChange={ this.handleChange }/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {sending}
                <div>
                    <p>The id of your search is: { this.state.response }</p>
                </div>
            </div>
        );
    }
}