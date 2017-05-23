import React from 'react';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-container">
                <header>
                    <p> Here is a header VERSION 2</p>
                </header>
                <div className="app-content">{this.props.children}</div>
                <footer>
                    <p> This is a footer </p>
                </footer>
            </div>
        );
    }
}