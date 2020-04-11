import types from './actionTypes'

export const logInStart = () => ({
  type: types.LOG_IN_START,
})

export const logInError = () => ({
  type: types.LOG_IN_ERROR,
})

export const invalidCredentials = () => ({
  type: types.INVALID_CREDENTIALS,
})

export const usernameTaken = () => ({
  type: types.USERNAME_TAKEN,
})

export const clearErrors = () => ({
  type: types.CLEAR_ERRORS,
})

export const reset = () => ({
  type: types.RESET,
})
