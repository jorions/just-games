'use strict'

const { ValidationError } = require('../Errors')
const games = require('./games')
const generateId = require('./generateId')
const structs = require('./structs')

const ACCOUNT_TAKEN = 'accountTaken'
const GAME_NOT_FOUND = 'gameNotFound'
const PLAYER_IN_GAME = 'playerInGame'
const INVALID_PASSWORD = 'invalidPassword'
const INVALID_GAME_TYPE = 'invalidGameType'
const UNAUTHORIZED = 'unauthorized'

const MAX_TIME_BEFORE_INACTIVE_IN_MS = 1000 * 20 // 20s
const MAX_TIME_BEFORE_DELETE_IN_MS = 1000 * 60 * 60 * 24 // 1d

const store = {
  games: {
    /*
    [id]: {
      type: String
      password: String
      owner: String
      players: {
        [username]: {
          isActive: Bool
          ....
        }
      }
      addOrRefreshPlayer: fn
      refreshPlayer: fn
      markPlayerInactive: fn
      removePlayer: fn // TODO: This is unused
      getGame: fn
      submitAction: fn
    }
    */
  },
  users: {
    /*
    [username]: {
      isActive: Bool
      lastUpdated: ISO String
    }
    */
  },
  message: null, // TODO: Implement message endpoint
}

// Once every 10s, update players in games and delete empty games
setInterval(() => {
  Object.entries(store.games).forEach(([gameId, { players }]) => {
    const now = Date.now()
    let deleteGame = true
    Object.entries(players).forEach(([username, userGameInfo]) => {
      // If the player is currently active and hasn't polled in too long, mark inactive for game
      if (userGameInfo.isActive && now - userGameInfo.lastPolled > MAX_TIME_BEFORE_INACTIVE_IN_MS) {
        store.games[gameId].markPlayerInactive(username)
      }
      if (store.games[gameId].players[username].isActive) deleteGame = false
    })
    if (deleteGame) delete store.games[gameId]
  })
}, 10000)
// Once every 10s, clean up users
setInterval(() => {
  Object.entries(store.users).forEach(([username, { lastUpdated }]) => {
    const now = Date.now()
    if (now - lastUpdated > MAX_TIME_BEFORE_DELETE_IN_MS) delete store.users[username]
    else if (now - lastUpdated > MAX_TIME_BEFORE_INACTIVE_IN_MS)
      store.users[username].isActive = false
  })
}, 10000)

const refreshUser = username => {
  store.users[username] = {
    isActive: true,
    lastUpdated: Date.now(),
  }
}

const getAllActiveUsernamesInGames = gameIdToFilter => {
  const activeUsers = []
  Object.entries(store.games)
    .filter(([id]) => (gameIdToFilter ? gameIdToFilter !== id : true))
    .forEach(([, { players }]) =>
      Object.entries(players)
        .filter(([, { isActive }]) => isActive)
        .forEach(([username]) => activeUsers.push(username)),
    )
  return activeUsers
}

const logIn = username => {
  const user = store.users[username]
  if (user && user.isActive) throw new ValidationError('Account is already taken', ACCOUNT_TAKEN)
  refreshUser(username)
}

const createGame = ({ gameType, gameName, password, username }) => {
  if (getAllActiveUsernamesInGames().includes(username))
    throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)

  if (!games[gameType]) throw new ValidationError('Invalid game type', INVALID_GAME_TYPE)

  const id = generateId(store.games)
  store.games[id] = {
    type: gameType,
    password,
    ...new games[gameType](gameName, username),
  }

  refreshUser(username)

  return id
}

const getGames = username => {
  refreshUser(username)
  return Object.entries(store.games).map(([id, { type, owner, name, password, players }]) => ({
    type,
    owner,
    name,
    passwordRequired: !!password,
    players: Object.keys(players),
    id,
  }))
}

// TODO: On first fetch of game do isInAnotherGame check.
// TODO: On subsequent fetches make sure user is already in game.

const getGame = ({ id, username, password }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  const playerIsInAnotherGame = getAllActiveUsernamesInGames(id).some(u => u === username)
  if (playerIsInAnotherGame)
    throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)

  if (!game.players[username] && game.password && game.password !== password)
    throw new ValidationError('Invalid password', INVALID_PASSWORD)

  game.addOrRefreshPlayer(username)

  refreshUser(username)

  return { type: game.type, ...game.getGame(username) }
}

const deleteGame = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.owner !== username) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  refreshUser(username)

  delete store.games[id]
}

const submitAction = ({ id, username, action, data }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (!game.players[username]) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  game.submitAction({ username, action, data })
  game.refreshPlayer(username)

  refreshUser(username)
}

const markPlayerInactive = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.players[username]) game.markPlayerInactive(username)
}

module.exports = {
  logIn,
  createGame,
  getGames,
  getGame,
  deleteGame,
  submitAction,
  markPlayerInactive,
  ...structs,
  validationErrors: {
    ACCOUNT_TAKEN,
    GAME_NOT_FOUND,
    PLAYER_IN_GAME,
    INVALID_PASSWORD,
    INVALID_GAME_TYPE,
    UNAUTHORIZED,
  },
}
