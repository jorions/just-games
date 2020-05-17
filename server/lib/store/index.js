'use strict'

const { ValidationError } = require('../Errors')
const randomString = require('./randomString')
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

const MAX_TIME_BEFORE_INACTIVE_IN_MS = 1000 * 60 * 2 // 2m
const MAX_TIME_BEFORE_DELETE_IN_MS = 1000 * 60 * 60 * 24 // 1d
const MAX_TIME_BEFORE_DELETE_GAME_IN_MS = 1000 * 60 * 2 // 2m

const store = {
  gamesLastUpdated: Date.now(),
  history: {
    totalGames: 0,
    totalUsers: 0,
  },
  games: {
    /*
    [id]: {
      type: String
      name: String
      password: String
      owner: String
      lastUpdated: Date.now()
      players: {
        [username]: {
          isActive: Bool
          ....
        }
      }
      addOrRefreshPlayer: fn
      refreshPlayer: fn
      markPlayerInactive: fn
      removePlayer: fn
      getGame: fn
      submitAction: fn
    }
    */
  },
  users: {
    /*
    [username]: {
      isActive: Bool
      lastUpdated: Date.now()
      id: String
    }
    */
  },
  message: null,
}

const updateGamesList = now => {
  store.gamesLastUpdated = now || Date.now()
}

const updateGame = game => {
  const now = Date.now()
  game.lastUpdated = now // eslint-disable-line no-param-reassign
  updateGamesList(now)
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
        updateGame(store.games[gameId])
      }
      if (store.games[gameId].players[username].isActive) deleteGame = false
    })
    if (deleteGame && now - store.games[gameId].lastUpdated > MAX_TIME_BEFORE_DELETE_GAME_IN_MS) {
      delete store.games[gameId]
      updateGamesList()
    }
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

const userRefreshData = () => ({
  isActive: true,
  lastUpdated: Date.now(),
})

const refreshUser = username => {
  store.users[username] = {
    ...store.users[username],
    ...userRefreshData(),
  }
}

const getAllActiveUsernamesInGames = gameIdToFilter => {
  const activeUsers = []
  Object.entries(store.games)
    .filter(([id]) => (gameIdToFilter ? gameIdToFilter !== id : true))
    .forEach(([, { players }]) => {
      Object.entries(players)
        .filter(([, { isActive }]) => isActive)
        .forEach(([username]) => activeUsers.push(username))
    })
  return activeUsers
}

//  ==== ADMIN FUNCTIONALITY ====
const getMessage = () => store.message

const setMessage = message => {
  store.message = message
}

const getOverview = () => {
  const gamesOverview = {
    data: {},
    totalCurrentCount: 0,
    totalHistoryCount: store.history.totalGames,
  }
  Object.entries(store.games).forEach(([id, { type, name, owner, lastUpdated, players: p }]) => {
    const gameType = gamesOverview.data[type]
    const players = {}
    Object.entries(p).forEach(([username, { isActive, timeJoined, lastPolled }]) => {
      players[username] = {
        isActive,
        timeJoined: new Date(timeJoined),
        lastPolled: new Date(lastPolled),
      }
    })
    const data = { id, name, owner, lastUpdated: new Date(lastUpdated), players }
    if (gameType) {
      gameType.count += 1
      gameType.games.push(data)
    } else {
      gamesOverview.data[type] = {
        count: 1,
        games: [data],
      }
    }
    gamesOverview.totalCurrentCount += 1
  })

  const usersOverview = {
    data: {
      active: { count: 0, users: [] },
      inactive: { count: 0, users: [] },
    },
    totalCurrentCount: 0,
    totalHistoryCount: store.history.totalUsers,
  }
  Object.entries(store.users).forEach(([username, { isActive, lastUpdated }]) => {
    const userType = usersOverview.data[isActive ? 'active' : 'inactive']
    userType.count += 1
    userType.users.push({ username, lastUpdated: new Date(lastUpdated) })
    usersOverview.totalCurrentCount += 1
  })

  return {
    games: gamesOverview,
    users: usersOverview,
    message: store.message,
  }
}
// ==== END ADMIN FUNCTIONALITY ====

const logIn = username => {
  const user = store.users[username]
  if (user && user.isActive) throw new ValidationError('Account is already taken', ACCOUNT_TAKEN)
  const id = randomString(16)
  store.users[username] = { id, ...userRefreshData() }
  store.history.totalUsers += 1
  return id
}

const userIsValid = (username, id) => store.users[username] && store.users[username].id === id

const createGame = ({ gameType, gameName, password, username }) => {
  if (getAllActiveUsernamesInGames().includes(username))
    throw new ValidationError('Player is already in a game', PLAYER_IN_GAME)

  if (!games[gameType]) throw new ValidationError('Invalid game type', INVALID_GAME_TYPE)

  const id = generateId(store.games)
  store.games[id] = {
    type: gameType,
    password,
    lastUpdated: Date.now(),
    ...new games[gameType].Game(gameName || id.split('-').join(' '), username, () =>
      updateGame(store.games[id]),
    ),
  }

  refreshUser(username)

  updateGamesList()

  store.history.totalGames += 1

  return id
}

const getGames = (username, lastUpdated) => {
  refreshUser(username)

  return {
    lastUpdated: store.gamesLastUpdated,
    games:
      lastUpdated === store.gamesLastUpdated
        ? null
        : Object.entries(store.games).map(([id, { type, owner, name, password, players }]) => ({
            type,
            owner,
            name,
            passwordRequired: !!password,
            players: Object.keys(players),
            id,
          })),
  }
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
      updateGame(game)
    } else {
      if (!player.isActive) {
        // Player is becoming active again, so update
        updateGame(game)
      }
      returnGame = game.lastUpdated !== lastUpdated
    }

    game.addOrRefreshPlayer(username)
    refreshUser(username)
  }

  return returnGame
    ? { id, type: game.type, lastUpdated: game.lastUpdated, ...game.getGame(username) }
    : null
}

const deleteGame = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.owner !== username) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  refreshUser(username)

  delete store.games[id]
  updateGamesList()
}

const submitAction = ({ id, username, action, data }) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (!game.players[username]) throw new ValidationError('Unauthorized', UNAUTHORIZED)

  const Struct = games[game.type].structs[action]
  if (!Struct) throw new ValidationError('Invalid action', INVALID_ACTION)

  if (data) Struct({ data })

  game.submitAction({ username, action, data })
  game.refreshPlayer(username)

  refreshUser(username)

  updateGame(game)
}

const markPlayerInactive = (id, username) => {
  const game = store.games[id]
  if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)

  if (game.players[username]) {
    game.markPlayerInactive(username)
    updateGame(game)
  }
}

const removeUser = (username, gameId) => {
  delete store.users[username]
  if (gameId) {
    const game = store.games[gameId]
    if (!game) throw new ValidationError('Game not found', GAME_NOT_FOUND)
    game.removePlayer(username)
    updateGame(game)
  }
}

module.exports = {
  logIn,
  userIsValid,
  getMessage,
  setMessage,
  getOverview,
  createGame,
  getGames,
  getGame,
  deleteGame,
  submitAction,
  markPlayerInactive,
  removeUser,
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
