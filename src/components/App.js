import React, {Component} from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from "../config/apolloClient";

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <code>
                    <h1>
                        <center>Hello World!</center>
                    </h1>
                </code>
            </ApolloProvider>
        );
    }
}

export default App;
