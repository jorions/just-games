import 'core-js/stable' // Import before everything to use throughout the app
import 'regenerator-runtime/runtime' // Needed to use the transpiled generator fns from core-js
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'
import red from '@material-ui/core/colors/red'

import models from 'models'

import ErrorBoundary from 'components/ErrorBoundary'
import App from 'components/App'

import './styles/index.css'

const { IN_DEV_MODE } = process.env

/* eslint-disable no-underscore-dangle */

const store =
  IN_DEV_MODE && window.__REDUX_DEVTOOLS_EXTENSION__
    ? createStore(
        models,
        // createStore expects (reducer, preloadedState, enhancer). If only two
        // arguments are supplied and the 2nd is a function, then it's considered
        // to be an enhancer. To fit our middleware and devtools (both enhancers)
        // into 1 argument we need to merge them with compose().
        compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__()),
      )
    : createStore(models, applyMiddleware(thunk))
/* eslint-enable */

// Selected based on colors provided at
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=00E676&secondary.color=00B0FF
const theme = createMuiTheme({
  // Move to the new material-ui typography
  // https://material-ui.com/style/typography/#migration-to-typography-v2
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: '#15d8b1' },
    secondary: { main: lightBlue.A400 },
    error: { main: red.A400 },
  },
  overrides: {
    MuiFormControlLabel: {
      root: {
        marginLeft: '0px',
        marginRight: '0px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: '1rem',
      },
    },
  },
})

render(
  <ErrorBoundary>
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
)
