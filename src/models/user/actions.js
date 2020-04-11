import types from './actionTypes'

// eslint-disable-next-line import/prefer-default-export
export const logInSuccess = username => {
  return { type: types.LOG_IN_SUCCESS, username }
}
