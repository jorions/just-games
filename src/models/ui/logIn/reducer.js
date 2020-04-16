import userActions from 'models/user/actionTypes'
import types from './actionTypes'

const initialErrors = {
  usernameTaken: false,
  logInError: false,
}

const initialState = {
  logInLoading: false,
  ...initialErrors,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case userActions.LOG_IN_SUCCESS:
    case types.RESET:
      return {
        ...initialState,
      }
    case types.LOG_IN_START:
      return {
        ...initialState,
        logInLoading: true,
      }
    case types.LOG_IN_ERROR:
      return {
        ...initialState,
        logInError: true,
      }
    case types.USERNAME_TAKEN:
      return {
        ...initialState,
        usernameTaken: true,
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        ...initialErrors,
      }
    default:
      return state
  }
}
