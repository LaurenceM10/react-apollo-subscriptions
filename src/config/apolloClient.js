import ApolloClient from "apollo-client";
import {WebSocketLink} from 'apollo-link-ws';
import {HttpLink} from 'apollo-link-http';
import {split} from 'apollo-link';
import {getMainDefinition} from 'apollo-utilities';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {setContext} from "apollo-link-context";
import { URL, WS_URL } from "../config/urls";

// Build an HTTP link
const httpLink = new HttpLink({
    uri: URL,
});

// Create auth link to set headers like authorization and others
const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// Create the Web Socket link to make ws requests
const wsLink = new WebSocketLink({
    uri: WS_URL,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem('token'),
        }
    }
});

// Use split to use one or the other link depending on the type of operation to be performed.
// If it is an http operation (query or mutation) use authLink, otherwise use wsLink
// More info: https://www.apollographql.com/docs/link/composition#directional
const link = split(
    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    // Concat function merge links - in this case merges authLink with httpLink
    authLink.concat(httpLink),
);

// Build Apollo Client with the specific link
const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

export default client;