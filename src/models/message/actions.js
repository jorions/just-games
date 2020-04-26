import types from './actionTypes'

export const setMessage = message => ({
  type: types.SET_MESSAGE,
  message,
})

export const confirmMessage = () => ({
  type: types.CONFIRM_MESSAGE,
})
