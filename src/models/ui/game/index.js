import axios from 'lib/axios'
import handleError from 'models/helpers/handleError'
import * as actions from './actions'

export { default } from './reducer'

const { clearErrors } = actions
export { clearErrors }

const { SERVER_URL } = process.env

let poll = null

const stopPollingForGame = () => {
  clearTimeout(poll)
}

export const reset = id => (dispatch, getState) => {
  const {
    ui: {
      game: { gameNotFound, invalidPassword, playerInGame, gameEnded },
    },
  } = getState()
  stopPollingForGame()
  if (!gameNotFound && !invalidPassword && !playerInGame && !gameEnded)
    axios
      .post(`${SERVER_URL}/api/games/${id}/inactivePlayer`)
      .catch(() => console.log('Error marking you inactive')) // eslint-disable-line no-console
  dispatch(actions.reset())
}

const formatGame = (game, username) => ({
  ...game,
  players: Object.entries(game.players).map(([u, info]) => ({ username: u, ...info })),
  yourCards: game.players[username].cards,
})

export const fetchGame = ({ id, password, onSuccess, isPoll = false }) => async (
  dispatch,
  getState,
) => {
  const {
    user: { username },
  } = getState()

  if (!username) return // Avoid fetching if we log out while polling

  if (!isPoll) {
    if (poll) stopPollingForGame()
    dispatch(actions.fetchGameStart())
  }

  try {
    const {
      data: { game },
    } = await axios.get(`${SERVER_URL}/api/games/${id}`, isPoll ? {} : { params: { password } }) // Send username on first fetch to add user to game
    if (onSuccess) onSuccess()
    dispatch(actions.fetchGameSuccess(formatGame(game, username)))
    poll = setTimeout(() => dispatch(fetchGame({ id, isPoll: true })), 2500)
  } catch (err) {
    dispatch(
      handleError(err, {
        401: actions.invalidPassword,
        404: () => {
          const {
            ui: {
              game: { game },
            },
          } = getState()
          return game ? actions.gameEnded() : actions.gameNotFound()
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
    dispatch(actions.submitActionSuccess(formatGame(game, username)))
    if (onSuccess) onSuccess()
    setTimeout(() => dispatch(fetchGame({ id, isPoll: true })), 2500)
  } catch (err) {
    dispatch(handleError(err, actions.submitActionError))
  }
}
