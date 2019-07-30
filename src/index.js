import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'

import configureStore from './store'

import App from './app'

const history = createBrowserHistory()

const Whitelabel = props => {
  return (
    <Provider store={configureStore(history)}>
      <Router history={history}>
        <Route component={App} />
      </Router>
    </Provider>
  )
}

ReactDOM.render(<Whitelabel />, document.getElementById('root'))
