import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import ErrorIcon from '@material-ui/icons/Error'

import './styles.css'

class ErrorBoundary extends Component {
  state = { error: null, componentStack: null }

  componentDidCatch(error, info) {
    this.setState({
      error,
      componentStack: (info && info.componentStack) || 'unknown component stack',
    })
  }

  renderError() {
    const { error, componentStack } = this.state

    return (
      <div id="errorStack" styleName="errorStack">
        <div>{error.toString()}</div>
        <div>{error.stack.replace(/(\r\n|\n|\r)/gm, '\n').split('\n')[1]}</div>
        <ul>
          {componentStack
            .replace(/(\r\n|\n|\r)/gm, '\n')
            .split('\n')
            .map((trace, idx) =>
              idx === 0 ? null : (
                <li key="trace" className="hide-bullets">
                  {trace}
                </li>
              ),
            )}
        </ul>
      </div>
    )
  }

  render() {
    const { children } = this.props
    const { error } = this.state

    return error ? (
      <div className="center mt4 ph2">
        <div>
          <ErrorIcon color="error" styleName="errorIcon" className="mb3" />
        </div>
        <Typography variant="h1" className="mb3 hide-on-mobile">
          Well this is awkard...
        </Typography>
        <Typography variant="h2" className="mb3 hide-on-desktop">
          Well this is awkard...
        </Typography>
        <Typography variant="h2" className="mb4 hide-on-mobile">
          The page just crashed :(
        </Typography>
        <Typography variant="h4" className="mb3 hide-on-desktop">
          The page just crashed :(
        </Typography>
        <Typography variant="h4" className="mb4 hide-on-mobile">
          Refresh to fix the problem
        </Typography>
        <Typography variant="h5" className="mb2 hide-on-desktop">
          Refresh to fix the problem
        </Typography>
        <div className="flex-centered">{this.renderError()}</div>
      </div>
    ) : (
      children
    )
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
