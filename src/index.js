import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { Route, HashRouter, Switch, Redirect } from 'react-router-dom'
import WindowOperationContainer from './component/WindowOperationContainer'
import { MuiThemeProvider } from '@material-ui/core'
import { darkTheme } from './dark.ts'
ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={darkTheme}>
      <WindowOperationContainer />
      <HashRouter>
        <App />
      </HashRouter>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
