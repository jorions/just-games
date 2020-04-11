import axios from 'lib/axios'
import handleError from 'models/helpers/handleError'
import * as userActions from 'models/user'
import * as actions from './actions'

export { default } from './reducer'

const { clearErrors, reset } = actions
export { clearErrors }
export { reset }

const { SERVER_URL } = process.env

export const submitLogIn = ({ username, password, isCreate }) => async dispatch => {
  dispatch(actions.logInStart())
  try {
    await axios.post(`${SERVER_URL}/users/log-in`, { username, password, isCreate })
    dispatch(userActions.logInSuccess(username))
  } catch (err) {
    dispatch(
      handleError(err, {
        401: actions.invalidCredentials,
        409: actions.usernameTaken,
        defaultHandler: actions.logInError,
      }),
    )
  }
}
