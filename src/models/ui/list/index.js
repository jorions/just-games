import axios from 'lib/axios'
import handleError from 'models/helpers/handleError'
import { setMessage } from 'models/message'
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
  const {
    user: { username },
    ui: {
      list: { lastUpdated },
    },
  } = getState()

  if (!username) return // Avoid fetching if we log out while polling

  if (!isPoll) {
    if (poll) stopPollingForGames()
    dispatch(actions.fetchListStart())
  }

  try {
    const {
      data: { games, lastUpdated: newLastUpdated, message },
    } = await axios.get(`${SERVER_URL}/api/games`, isPoll ? { params: { lastUpdated } } : {})
    if (games) dispatch(actions.fetchListSuccess(games, newLastUpdated))
    dispatch(setMessage(message))
    poll = setTimeout(() => dispatch(fetchGames(true)), 2500)
  } catch (err) {
    if (!getState().user.username) return // Avoid showing error if we log out while polling
    dispatch(
      handleError(err, () => {
        // Silently fail
        if (isPoll) {
          poll = setTimeout(() => dispatch(fetchGames(true)), 2500)
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
    } = await axios.post(`${SERVER_URL}/api/games`, { gameName, gameType, password })
    dispatch(actions.createGameSuccess(id))
  } catch (err) {
    dispatch(
      handleError(err, { 409: actions.playerInGame, defaultHandler: actions.createGameError }),
    )
  }
}
