import { getUser } from 'lib/storage'
import { types as globalTypes } from 'models/globalActions'
import types from './actionTypes'

const { username = null } = getUser()

const initialState = { username }

export default (state = initialState, action) => {
  switch (action.type) {
    case globalTypes.LOG_OUT:
      return { username: getUser().username }
    case types.LOG_IN_SUCCESS:
      return {
        ...state,
        username: action.username,
      }
    default:
      return state
  }
}
