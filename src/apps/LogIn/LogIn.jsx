import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { shortStringCharLimit } from 'shared/validations'

import ErrorModal, { buildErrorProps } from 'components/ErrorModal'
import TextInput from 'components/TextInput'
import Spinner from 'components/Spinner'
import KeyPressListener from 'components/KeyPressListener'

import './styles.css'

class LogIn extends PureComponent {
  state = { username: '' }

  componentWillUnmount() {
    const { reset } = this.props
    reset()
  }

  handleChange = ({ target: { name, value } }) => {
    if (value.length <= shortStringCharLimit) this.setState({ [name]: value })
  }

  handleSubmit = () => {
    const { usernameTaken, submitLogIn } = this.props
    const { username } = this.state

    if (usernameTaken || !username) return

    submitLogIn(username)
  }

  renderErrorModal() {
    const { usernameTaken, logInError, clearErrors } = this.props

    return (
      <ErrorModal
        options={[
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
    const { logInLoading } = this.props
    const { username } = this.state

    const disableButton = !username

    return (
      <>
        <div styleName="container" className="flex-centered ph4">
          <KeyPressListener onKeyPress={this.handleSubmit} enterKey />
          <div>
            <div className="w-100 center mb4">
              <div className="inline-block w-100 mb3">
                <Typography variant="h4">Just games. Plain and simple.</Typography>
              </div>
              <div className="inline-block w-100">
                <Typography variant="h6">Pick a username and start playing</Typography>
              </div>
            </div>
            <div className="flex-centered">
              <div styleName="form">
                {this.renderErrorModal()}
                <TextInput
                  name="username"
                  value={username}
                  placeholder="Username"
                  fullWidth
                  onChange={this.handleChange}
                />
                <div className="mv4 h4">
                  {logInLoading ? (
                    <div className="w4 h4">
                      <Spinner />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      name="logIn"
                      onClick={this.handleSubmit}
                      disabled={disableButton}
                      fullWidth
                      className="mb3"
                    >
                      Start Playing
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

LogIn.propTypes = {
  logInLoading: PropTypes.bool.isRequired,
  usernameTaken: PropTypes.bool.isRequired,
  logInError: PropTypes.bool.isRequired,
  submitLogIn: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

export default LogIn
