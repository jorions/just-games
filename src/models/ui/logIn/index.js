import axios from 'lib/axios'
import handleError from 'models/helpers/handleError'
import * as userActions from 'models/user'
import * as actions from './actions'

export { default } from './reducer'

const { clearErrors, reset } = actions
export { clearErrors }
export { reset }

const { SERVER_URL } = process.env

export const submitLogIn = username => async dispatch => {
  dispatch(actions.logInStart())
  try {
    await axios.post(`${SERVER_URL}/api/users/logIn`, { username })
    dispatch(userActions.logInSuccess(username))
  } catch (err) {
    dispatch(
      handleError(err, {
        409: actions.usernameTaken,
        defaultHandler: actions.logInError,
      }),
    )
  }
}
