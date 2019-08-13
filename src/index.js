import './index.css'
import * as serviceWorker from './serviceWorker'
import Main from './containers/Main'
import { getToken } from './lib/utils'

import dotenv from 'dotenv'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { WebSocketLink } from 'apollo-link-ws'
import { createHttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import URI from 'urijs'
import { ApolloProvider } from '@apollo/react-hooks'

dotenv.config()

const {
  location: { origin }
} = global

const endpoint = `${origin}/api/`

const httpLink = createHttpLink({
  uri: endpoint,
  credentials: 'same-origin'
})

// const httpLink = createHttpLink({
//   uri: 'http://localhost:4000',
//   credentials: 'same-origin'
// })

const wsUri = new URI(endpoint)

let schema = wsUri.scheme()

switch (schema) {
  case 'http':
    schema = 'ws'
    break

  case 'https':
  default:
    schema = 'wss'
    break
}

wsUri.scheme(schema)

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  new WebSocketLink({
    // uri: 'ws://localhost:4000',
    uri: wsUri.toString(),
    options: {
      reconnect: true
    }
  }),
  httpLink
)

const authLink = setContext((_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const apolloClient = new ApolloClient({
  connectToDevTools: process.browser,
  ssrMode: !process.browser,
  ssrForceFetchDelay: 100,
  link: authLink.concat(link),
  cache: new InMemoryCache().restore({})
})

const main = (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </ApolloProvider>
)

ReactDOM.render(main, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
