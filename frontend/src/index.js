

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App.jsx';

import { createUploadLink } from 'apollo-upload-client'

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context';

const httpLink = createUploadLink({
  uri: 'http://127.0.0.1:8001/graphql'
});
// const httpLink = createHttpLink({
//   uri: 'http://127.0.0.1:8001/graphql'
// });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'Authorization': token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  onError: ({ networkError, graphQLErrors }) => {
    console.log('graphQLErrors', graphQLErrors)
    console.log('networkError', networkError)
  },
  link: httpLink,
  // cache: new InMemoryCache()
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  })
})


ReactDOM.render(
  <ApolloProvider client={client}>
    {/* <Provider store={store}> */}
      {/* <Notification /> */}
      <App />
    {/* </Provider> */}
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
