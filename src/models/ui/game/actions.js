import types from './actionTypes'

export const fetchGameStart = () => ({
  type: types.FETCH_GAME_START,
})

export const fetchGameSuccess = game => ({
  type: types.FETCH_GAME_SUCCESS,
  game,
})

export const fetchGameError = () => ({
  type: types.FETCH_GAME_ERROR,
})

export const gameNotFound = () => ({
  type: types.GAME_NOT_FOUND,
})

export const pollGameError = () => ({
  type: types.POLL_GAME_ERROR,
})

export const invalidPassword = () => ({
  type: types.INVALID_PASSWORD,
})

export const playerInGame = () => ({
  type: types.PLAYER_IN_GAME,
})

export const deleteGameStart = () => ({
  type: types.DELETE_GAME_START,
})

export const deleteGameSuccess = () => ({
  type: types.DELETE_GAME_SUCCESS,
})

export const deleteGameError = () => ({
  type: types.DELETE_GAME_ERROR,
})

export const gameEnded = () => ({
  type: types.GAME_ENDED,
})

export const submitActionLoading = () => ({
  type: types.SUBMIT_ACTION_START,
})

export const submitActionSuccess = game => ({
  type: types.SUBMIT_ACTION_SUCCESS,
  game,
})

export const submitActionError = () => ({
  type: types.SUBMIT_ACTION_ERROR,
})

export const clearErrors = () => ({
  type: types.CLEAR_ERRORS,
})

export const reset = () => ({
  type: types.RESET,
})
