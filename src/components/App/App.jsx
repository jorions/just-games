import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Route } from 'react-router-dom'
import { Redirect, Switch } from 'react-router'

import { logIn, logOut, game } from 'routes'

import Game from 'apps/Game'
import List from 'apps/List'
import LogIn from 'apps/LogIn'
import ErrorBoundary from 'components/ErrorBoundary'
import Nav from './Nav'
import PathFallback from './PathFallback'

import './styles.css'

class App extends PureComponent {
  state = { collapsed: false }

  toggleCollapse = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }))
  }

  render() {
    const { loggedIn, className } = this.props
    const { collapsed } = this.state
    return (
      <ErrorBoundary>
        <Nav collapsed={collapsed} toggleCollapse={this.toggleCollapse} />
        <div className={className} styleName="appContainer">
          <Switch>
            <Route exact path="/" render={() => (!loggedIn ? <Redirect to={logIn} /> : <List />)} />
            <Route path={logIn} render={() => (loggedIn ? <Redirect to="/" /> : <LogIn />)} />
            <Route
              path={game(':id')}
              render={() => (!loggedIn ? <Redirect to={logIn} /> : <Game />)}
            />
            <Route path={logOut} render={() => <Redirect to={logIn} />} />
            <Route component={PathFallback} />
          </Switch>
        </div>
      </ErrorBoundary>
    )
  }
}
App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
}

// react-hot-loader automatically does not run when process.env === 'production'
export default hot(App)
