'use strict'

const { ValidationError } = require('../Errors')
const randomString = require('../randomString')
const games = require('./games')
const structs = require('./structs')

const GAME_NOT_FOUND = 'gameNotFound'
const PLAYER_IN_GAME = 'playerInGame'
const INVALID_PASSWORD = 'invalidPassword'
const INVALID_GAME_TYPE = 'invalidGameType'
const UNAUTHORIZED = 'unauthorized'

const store = {
  games: {
    /*
    [id]: {
      type: String
      ...gameHelpers
    }
    */
  },
}
const getAllActiveUsernames = gameIdToFilter => {
  const activeUsers = []
  Object.entries(store.games)
    .filter(([id]) => (gameIdToFilter ? gameIdToFilter !== id : true))
    .forEach(([, { getGame }]) =>
      Object.entries(getGame().players)
        .filter(([, { isActive }]) => isActive)
        .forEach(([username]) => activeUsers.push(username)),
    )
  return activeUsers
}

const initialize = () => {
  return Promise.resolve()
}

const createGame = ({ gameType, gameName, password, username }) => {
  if (getAllActiveUsernames().includes(username))
    throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)

  if (!games[gameType]) throw new ValidationError('Invalid game type', INVALID_GAME_TYPE)

  const id = randomString(16)
  store.games[id] = {
    type: gameType,
    password,
    ...new games[gameType](gameName, username),
  }

  return id
}

const getGames = () =>
  Object.entries(store.games).map(([id, { type, password, getGame }]) => {
    const { owner, name, players } = getGame()
    return { type, owner, name, passwordRequired: !!password, players: Object.keys(players), id }
  })

const getGame = ({ id, username, password }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  const playerIsInAnotherGame = getAllActiveUsernames(id).some(u => u === username)
  if (playerIsInAnotherGame)
    throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)

  if (!game.players[username] && game.password && game.password !== password)
    throw new ValidationError('Invalid password', INVALID_PASSWORD)

  game.addOrRefreshPlayer(username)

  return { type: game.type, ...game.getGame(username) }
}

const deleteGame = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.owner !== username) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  delete store.games[id]
}

const submitAction = ({ id, username, action, data }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (!game.players[username]) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  game.submitAction({ username, action, data })
}

module.exports = {
  initialize,
  createGame,
  getGames,
  getGame,
  deleteGame,
  submitAction,
  ...structs,
  validationErrors: {
    GAME_NOT_FOUND,
    PLAYER_IN_GAME,
    INVALID_PASSWORD,
    INVALID_GAME_TYPE,
    UNAUTHORIZED,
  },
}
