import axios from 'lib/axios'
import handleError from 'models/helpers/handleError'
import * as actions from './actions'

export { default } from './reducer'

const { clearErrors } = actions
export { clearErrors }

const { SERVER_URL } = process.env

let poll = null

const stopPollingForGames = () => {
  clearTimeout(poll)
}

export const reset = () => dispatch => {
  stopPollingForGames()
  dispatch(actions.reset())
}

export const fetchGames = isPoll => async (dispatch, getState) => {
  if (!getState().user.username) return // Avoid fetching if we log out while polling

  if (!isPoll) {
    if (poll) stopPollingForGames()
    dispatch(actions.fetchListStart())
  }

  try {
    const {
      data: { games },
    } = await axios.get(`${SERVER_URL}/games`)
    dispatch(actions.fetchListSuccess(games))
    poll = setTimeout(() => dispatch(fetchGames(true)), 2000)
  } catch (err) {
    if (!getState().user.username) return // Avoid showing error if we log out while polling
    dispatch(
      handleError(err, () => {
        // Silently fail
        if (isPoll) {
          poll = setTimeout(() => dispatch(fetchGames(true)), 2000)
          return null
        }

        return actions.fetchListError()
      }),
    )
  }
}

export const createGame = ({ gameName, gameType, password }) => async dispatch => {
  dispatch(actions.createGameStart())
  try {
    const {
      data: { id },
    } = await axios.post(`${SERVER_URL}/games`, { gameName, gameType, password })
    dispatch(actions.createGameSuccess(id))
  } catch (err) {
    dispatch(
      handleError(err, { 409: actions.playerInGame, defaultHandler: actions.createGameError }),
    )
  }
}
