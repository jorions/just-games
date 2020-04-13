import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { shortStringCharLimit } from 'shared/validations'

import ErrorModal, { buildErrorProps } from 'components/ErrorModal'
import TextInput from 'components/TextInput'
import PasswordInput from 'components/PasswordInput'
import Spinner from 'components/Spinner'

import './styles.css'

class LogIn extends PureComponent {
  state = { username: '', password: '' }

  componentWillUnmount() {
    const { reset } = this.props
    reset()
  }

  handleChange = ({ target: { name, value } }) => {
    if (value.length <= shortStringCharLimit) this.setState({ [name]: value })
  }

  submit = isCreate => {
    const { invalidCredentials, usernameTaken, submitLogIn } = this.props
    const { username, password } = this.state

    if (invalidCredentials || usernameTaken || !username) return

    submitLogIn({ username, password, isCreate })
  }

  handleLogIn = () => {
    this.submit(false)
  }

  handleSignUp = () => {
    this.submit(true)
  }

  renderErrorModal() {
    const { invalidCredentials, usernameTaken, logInError, clearErrors } = this.props

    return (
      <ErrorModal
        options={[
          {
            isOpen: invalidCredentials,
            title: 'No worky',
            content: "That username/password combo doesn't exist",
          },
          {
            isOpen: usernameTaken,
            title: "You're not special",
            content: 'Someone already has that username.',
          },
          buildErrorProps({
            isOpen: logInError,
            brokeWhile: 'logging in',
          }),
        ]}
        onOKClick={clearErrors}
      />
    )
  }

  render() {
    const { logInLoading, invalidCredentials } = this.props
    const { username, password } = this.state

    const disableButton = invalidCredentials || !username

    return (
      <>
        <div styleName="container" className="flex-centered ph4 mb4">
          <div className="flex-centered w-100 mb4">
            <Typography variant="h4">Log In To Play!</Typography>
          </div>
          <div styleName="form">
            {this.renderErrorModal()}
            <TextInput
              name="username"
              value={username}
              placeholder="Username"
              label="Username"
              fullWidth
              onChange={this.handleChange}
            />
            <PasswordInput
              name="password"
              placeholder="Password (optional)"
              label="Password (optional)"
              value={password}
              onChange={this.handleChange}
            />
            <div className="mv4 flex-centered h4">
              {logInLoading ? (
                <div className="w4 h4">
                  <Spinner />
                </div>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    name="logIn"
                    onClick={this.handleLogIn}
                    disabled={disableButton}
                    fullWidth
                    className="mb3"
                  >
                    Log In
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    name="signUp"
                    onClick={this.handleSignUp}
                    disabled={disableButton}
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

LogIn.propTypes = {
  logInLoading: PropTypes.bool.isRequired,
  invalidCredentials: PropTypes.bool.isRequired,
  usernameTaken: PropTypes.bool.isRequired,
  logInError: PropTypes.bool.isRequired,
  submitLogIn: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

export default LogIn
