import React, { Suspense, lazy } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Router, Redirect } from '@reach/router'

import { logIn, logOut, game } from 'routes'
import style from 'lib/style'
import ErrorBoundary from 'components/ErrorBoundary'
import Modal from 'components/Modal'
import Spinner from 'components/Spinner'
import Nav from './Nav'
import PathFallback from './PathFallback'

import './styles.css'

const Game = lazy(() => import('apps/Game'))
const List = lazy(() => import('apps/List'))
const LogIn = lazy(() => import('apps/LogIn'))

// Use 'noThrow' to mute expected React error on redirect https://reach.tech/router/api/Redirect
const ConditionalRedirect = ({ redirect, redirectTo, Component, ...props }) =>
  redirect ? <Redirect to={redirectTo} noThrow /> : <Component {...props} />

ConditionalRedirect.propTypes = {
  redirect: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string.isRequired,
  Component: PropTypes.shape().isRequired,
}

const App = ({ loggedIn, read, message, className, confirmMessage }) => (
  <ErrorBoundary>
    <Modal
      isOpen={!!(!read && message)}
      title="Quick Heads Up Y'all"
      content={message}
      onOKClick={confirmMessage}
    />
    {loggedIn && <Nav />}
    <div className={className} styleName={style({ appContainer: true, loggedOut: !loggedIn })}>
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </div>
  </ErrorBoundary>
)

App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  read: PropTypes.bool.isRequired,
  message: PropTypes.string,
  className: PropTypes.string.isRequired,
  confirmMessage: PropTypes.func.isRequired,
}

App.defaultProps = {
  message: null,
}

// react-hot-loader automatically does not run when process.env === 'production'
export default hot(App)
