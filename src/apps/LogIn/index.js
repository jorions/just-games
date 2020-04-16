import { connect } from 'react-redux'

import { submitLogIn, clearErrors, reset } from 'models/ui/logIn'

import LogIn from './LogIn'

const mapStateToProps = ({
  ui: {
    logIn: { logInLoading, usernameTaken, logInError },
  },
}) => ({
  logInLoading,
  usernameTaken,
  logInError,
})

export default connect(mapStateToProps, { submitLogIn, clearErrors, reset })(LogIn)
