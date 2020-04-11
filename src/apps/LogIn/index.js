import { connect } from 'react-redux'

import { submitLogIn, clearErrors, reset } from 'models/ui/logIn'

import LogIn from './LogIn'

const mapStateToProps = ({
  ui: {
    logIn: { logInLoading, invalidCredentials, usernameTaken, logInError },
  },
}) => ({
  logInLoading,
  invalidCredentials,
  usernameTaken,
  logInError,
})

export default connect(mapStateToProps, { submitLogIn, clearErrors, reset })(LogIn)
