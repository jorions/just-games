import axios from 'lib/axios'
import { getUser, removeUser } from 'lib/storage'
import * as actions from './actions'

export { default as types } from './actionTypes'

const { SERVER_URL } = process.env

export const logOut = () => (dispatch, getState) => {
  const { token } = getUser()
  const body = { token }
  const {
    ui: {
      game: { game },
    },
  } = getState()
  console.log(game)
  if (game && game.id) body.gameId = game.id
  axios
    .post(`${SERVER_URL}/api/users/logOut`, body)
    .catch(() => console.log('Error logging you out')) // eslint-disable-line no-console
  removeUser()
  dispatch(actions.logOut())
}
