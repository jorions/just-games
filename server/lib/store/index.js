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
const INVALID_ACTION = 'invalidAction'

const MAX_TIME_BEFORE_INACTIVE_IN_MS = 1000 * 20 // 20s
const MAX_TIME_BEFORE_DELETE_IN_MS = 1000 * 60 * 60 * 24 // 1d

const store = {
  games: {
    /*
    [id]: {
      type: String
      password: String
      owner: String
      lastUpdated: ISO String
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
  message: null,
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
        store.games[gameId].lastUpdated = Date.now()
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

const getMessage = () => store.message

const setMessage = message => {
  store.message = message
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
    lastUpdated: Date.now(),
    ...new games[gameType].Game(gameName, username),
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

// isUserReq = false when coming from submitAction
const getGame = ({ id, username, password, lastUpdated, isUserReq = true }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  const player = game.players[username]
  const isFirstGet = !player
  let returnGame = true

  if (isUserReq) {
    if (isFirstGet) {
      if (game.password && game.password !== password)
        throw new ValidationError('Invalid password', INVALID_PASSWORD)
      const playerIsInAnotherGame = getAllActiveUsernamesInGames(id).some(u => u === username)
      if (playerIsInAnotherGame)
        throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)
      // Player is joining the game, so update
      game.lastUpdated = Date.now()
    } else {
      if (!player.isActive) {
        // Player is becoming active again, so update
        game.lastUpdated = Date.now()
      }
      returnGame = game.lastUpdated !== Number(lastUpdated)
    }

    game.addOrRefreshPlayer(username)
    refreshUser(username)
  }

  return returnGame
    ? { type: game.type, lastUpdated: game.lastUpdated, ...game.getGame(username) }
    : null
}

const getGameStruct = (id, action) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)
  const struct = games[game.type].structs[action]
  if (!struct) throw new ValidationError('Invalid action', INVALID_ACTION)
  return struct
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

  game.submitAction({ username, action, data }, () => {
    game.lastUpdated = Date.now()
  })
  game.refreshPlayer(username)

  refreshUser(username)

  game.lastUpdated = Date.now()
}

const markPlayerInactive = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.players[username]) {
    game.markPlayerInactive(username)
    game.lastUpdated = Date.now()
  }
}

module.exports = {
  logIn,
  getMessage,
  setMessage,
  createGame,
  getGames,
  getGame,
  getGameStruct,
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
