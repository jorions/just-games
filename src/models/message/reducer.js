import { types as globalTypes } from 'models/globalActions'
import types from './actionTypes'

const initialState = {
  message: null,
  read: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_MESSAGE:
      return { ...state, message: action.message, read: false }
    case types.CONFIRM_MESSAGE:
      return { ...state, read: true }
    case globalTypes.LOG_OUT:
      return initialState
    default:
      return state
  }
}
