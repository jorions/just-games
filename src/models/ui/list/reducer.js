import { types as globalTypes } from 'models/globalActions'
import types from './actionTypes'

const initialErrors = {
  fetchGamesError: false,
  createGameError: false,
  playerInGame: false,
}

const initialState = {
  games: [
    /*
    {
      type: String
      owner: String
      name: String
      passwordRequired: Boolean
      players: [String]
      id: String
    }
    */
  ],
  fetchGamesLoading: false,
  newGameId: null,
  createGameLoading: false,
  ...initialErrors,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_LIST_START:
      return {
        ...state,
        games: [],
        fetchGamesLoading: true,
        fetchGamesError: false,
      }
    case types.FETCH_LIST_SUCCESS:
      return {
        ...state,
        games: action.games,
        fetchGamesLoading: false,
      }
    case types.FETCH_LIST_ERROR:
      return {
        ...state,
        fetchGamesLoading: false,
        fetchGamesError: true,
      }

    case types.CREATE_GAME_START:
      return {
        ...state,
        createGameLoading: true,
        createGameError: false,
      }
    case types.CREATE_GAME_SUCCESS:
      return {
        ...state,
        createGameLoading: false,
        newGameId: action.newGameId,
      }
    case types.CREATE_GAME_ERROR:
      return {
        ...state,
        createGameLoading: false,
        createGameError: true,
      }
    case types.PLAYER_IN_GAME:
      return {
        ...state,
        createGameLoading: false,
        playerInGame: true,
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
