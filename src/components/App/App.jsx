import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Router, Redirect } from '@reach/router'

import { logIn, logOut, game } from 'routes'
import style from 'lib/style'

import Game from 'apps/Game'
import List from 'apps/List'
import LogIn from 'apps/LogIn'
import ErrorBoundary from 'components/ErrorBoundary'
import Nav from './Nav'
import PathFallback from './PathFallback'

import './styles.css'

// Use 'noThrow' to mute expected React error on redirect https://reach.tech/router/api/Redirect
const ConditionalRedirect = ({ redirect, redirectTo, Component, ...props }) =>
  redirect ? <Redirect to={redirectTo} noThrow /> : <Component {...props} />

ConditionalRedirect.propTypes = {
  redirect: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string.isRequired,
  Component: PropTypes.shape().isRequired,
}

const App = ({ loggedIn, className }) => (
  <ErrorBoundary>
    {loggedIn && <Nav />}
    <div className={className} styleName={style({ appContainer: true, loggedOut: !loggedIn })}>
      <Router>
        <ConditionalRedirect path="/" redirect={!loggedIn} redirectTo={logIn} Component={List} />
        <ConditionalRedirect path={logIn} redirect={loggedIn} redirectTo="/" Component={LogIn} />
        <ConditionalRedirect
          path={game(':id')}
          redirect={!loggedIn}
          redirectTo={logIn}
          Component={Game}
        />
        <Redirect from={logOut} to={logIn} noThrow />
        <PathFallback default />
      </Router>
    </div>
  </ErrorBoundary>
)

App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
}

// react-hot-loader automatically does not run when process.env === 'production'
export default hot(App)
