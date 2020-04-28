import types from './actionTypes'

export const fetchListStart = () => ({
  type: types.FETCH_LIST_START,
})

export const fetchListSuccess = (games, lastUpdated) => ({
  type: types.FETCH_LIST_SUCCESS,
  games,
  lastUpdated,
})

export const fetchListError = () => ({
  type: types.FETCH_LIST_ERROR,
})

export const createGameStart = () => ({
  type: types.CREATE_GAME_START,
})

export const createGameSuccess = newGameId => ({
  type: types.CREATE_GAME_SUCCESS,
  newGameId,
})

export const createGameError = () => ({
  type: types.CREATE_GAME_ERROR,
})

export const playerInGame = () => ({
  type: types.PLAYER_IN_GAME,
})

export const clearErrors = () => ({
  type: types.CLEAR_ERRORS,
})

export const reset = () => ({
  type: types.RESET,
})
