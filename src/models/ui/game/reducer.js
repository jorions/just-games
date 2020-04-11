import { types as globalTypes } from 'models/globalActions'
import types from './actionTypes'

const initialErrors = {
  fetchGameError: false,
  gameNotFound: false,
  invalidPassword: false,
  playerInGame: false,
  pollingError: false,
  deleteGameError: false,
  submitActionError: false,
}

const initialState = {
  ...initialErrors,
  game: null,
  fetchGameLoading: false,
  deleteGameLoading: false,
  deleteGameSuccess: false,
  gameEnded: false,
  submitActionLoading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_GAME_START:
      return {
        ...initialState,
        fetchGameLoading: true,
      }
    case types.FETCH_GAME_SUCCESS:
      return {
        ...state,
        game: action.game,
        fetchGameLoading: false,
      }
    case types.FETCH_GAME_ERROR:
      return {
        ...state,
        fetchGameLoading: false,
        fetchGameError: true,
      }
    case types.GAME_NOT_FOUND:
      return {
        ...state,
        fetchGameLoading: false,
        gameNotFound: true,
      }
    case types.INVALID_PASSWORD:
      return {
        ...state,
        fetchGameLoading: false,
        invalidPassword: true,
      }
    case types.PLAYER_IN_GAME:
      return {
        ...state,
        fetchGameLoading: false,
        playerInGame: true,
      }
    case types.POLL_GAME_ERROR:
      return {
        ...state,
        pollingError: true,
      }
    case types.DELETE_GAME_START:
      return {
        ...state,
        deleteGameLoading: true,
        deleteGameError: false,
      }
    case types.DELETE_GAME_SUCCESS:
      return {
        ...state,
        deleteGameLoading: false,
        deleteGameSuccess: true,
      }
    case types.DELETE_GAME_ERROR:
      return {
        ...state,
        deleteGameLoading: false,
        deleteGameError: true,
      }
    case types.GAME_ENDED:
      return {
        ...state,
        gameEnded: true,
      }
    case types.SUBMIT_ACTION_START:
      return {
        ...state,
        submitActionLoading: true,
        submitActionError: false,
      }
    case types.SUBMIT_ACTION_SUCCESS:
      return {
        ...state,
        submitActionLoading: false,
        submitActionSuccess: true,
        game: action.game,
      }
    case types.SUBMIT_ACTION_ERROR:
      return {
        ...state,
        submitActionLoading: false,
        submitActionError: true,
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        ...initialErrors,
      }
    case types.RESET:
    case globalTypes.LOG_OUT:
      return initialState
    default:
      return state
  }
}
