import axios from 'lib/axios'
import { getUser } from 'lib/storage'
import handleError from 'models/helpers/handleError'
import { setMessage } from 'models/message'
import * as actions from './actions'
import formatGame from './formatGame'

export { default } from './reducer'

const { clearErrors } = actions
export { clearErrors }

const { SERVER_URL } = process.env

let poll = null

const stopPollingForGame = () => {
  clearTimeout(poll)
}

const markPlayerInactive = id => {
  const { token } = getUser()
  if (!token) return // Early-exit if this is calling because of logging out
  axios
    .post(`${SERVER_URL}/api/games/${id}/inactivePlayer`)
    .catch(() => console.log('Error marking you inactive')) // eslint-disable-line no-console
}

export const reset = id => (dispatch, getState) => {
  const {
    ui: {
      game: { gameNotFound, invalidPassword, playerInGame, gameEnded },
    },
  } = getState()
  stopPollingForGame()
  if (!gameNotFound && !invalidPassword && !playerInGame && !gameEnded) markPlayerInactive(id)
  dispatch(actions.reset())
}

export const fetchGame = ({ id, password, onSuccess, isPoll = false }) => async (
  dispatch,
  getState,
) => {
  const {
    user: { username },
    ui: {
      game: { game },
    },
  } = getState()

  if (!username) return // Avoid fetching if we log out while polling

  if (!isPoll) {
    if (poll) stopPollingForGame()
    dispatch(actions.fetchGameStart())
  }

  try {
    const {
      data: { game: updatedGame, message },
    } = await axios.get(
      `${SERVER_URL}/api/games/${id}`,
      isPoll ? { params: { lastUpdated: game.lastUpdated } } : { params: { password } },
    )
    if (onSuccess) onSuccess()
    if (updatedGame) {
      const gameFormatter = formatGame[updatedGame.type]
      dispatch(
        actions.fetchGameSuccess(
          gameFormatter ? gameFormatter(updatedGame, username) : updatedGame,
        ),
      )
    }
    dispatch(setMessage(message))
    poll = setTimeout(() => dispatch(fetchGame({ id, isPoll: true })), 2500)
  } catch (err) {
    dispatch(
      handleError(err, {
        401: actions.invalidPassword,
        404: () => {
          const {
            ui: {
              game: { game: currentGame },
            },
          } = getState()
          return currentGame ? actions.gameEnded() : actions.gameNotFound()
        },
        409: actions.playerInGame,
        defaultHandler: data =>
          isPoll ? actions.pollGameError(data) : actions.fetchGameError(data),
      }),
    )
  }
}

export const deleteGame = id => async dispatch => {
  try {
    if (poll) stopPollingForGame()
    dispatch(actions.deleteGameStart())
    await axios.delete(`${SERVER_URL}/api/games/${id}`)
    dispatch(actions.deleteGameSuccess())
  } catch (err) {
    dispatch(handleError(err, actions.deleteGameError))
  }
}

export const submitAction = ({ id, action, data, onSuccess }) => async (dispatch, getState) => {
  try {
    const {
      user: { username },
    } = getState()
    if (poll) stopPollingForGame()
    dispatch(actions.submitActionLoading())
    const {
      data: { game },
    } = await axios.post(`${SERVER_URL}/api/games/${id}/action`, {
      action,
      data,
    })
    dispatch(actions.submitActionSuccess(formatGame[game.type](game, username)))
    if (onSuccess) onSuccess()
    setTimeout(() => dispatch(fetchGame({ id, isPoll: true })), 2500)
  } catch (err) {
    dispatch(handleError(err, actions.submitActionError))
  }
}
