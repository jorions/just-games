import { removeUser } from 'lib/storage'
import * as actions from './actions'

export { default as types } from './actionTypes'

export const logOut = () => dispatch => {
  removeUser()
  dispatch(actions.logOut())
}
