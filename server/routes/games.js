'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')
const { parseAndRefreshAuth } = require('./middleware')

const router = buildRouter('/api/games')

/**
 * Responds
 *  200: OK
 *    games: [Game] || null (if not updated)
 *    lastUpdated: Number
 *    message: String || null
 *  500: Server error
 *    error: { message: 'Something broke while attempting to fetch games' }
 *
 *  403: Unauthorized
 */
router.get('/', parseAndRefreshAuth, ({ request, response, state }) => {
  try {
    const {
      query: { lastUpdated },
    } = request

    state.responseBodyMaxLoggingLen = 0 // eslint-disable-line no-param-reassign

    const { games, lastUpdated: lU } = store.getGames(state.username, Number(lastUpdated))

    response.body = {
      games,
      lastUpdated: lU,
      message: store.getMessage(),
    }
    response.status = 200
  } catch (err) {
    handleError({ response, state, err, msg: 'Something broke while attempting to fetch games' })
  }
})

/**
 * Responds
 *  200: OK
 *    game: Game || null (if not updated)
 *    message: String || null
 *  401: Unauthorized
 *    error: { message: 'You entered the wrong password', code: 'invalidPassword' }
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  409: Conflict
 *    error: { message: 'Player is already in a game', code: 'playerInGame' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to fetch the game' }
 *
 *  403: Unauthorized
 */
router.get('/:id', parseAndRefreshAuth, ({ request, response, state, captures: [id] }) => {
  try {
    const {
      query: { password, lastUpdated },
    } = request

    state.responseBodyMaxLoggingLen = 0 // eslint-disable-line no-param-reassign

    response.body = {
      game: store.getGame({ id, password, username: state.username, lastUpdated }),
      message: store.getMessage(),
    }
    response.status = 200
  } catch (err) {
    const options = {
      [store.validationErrors.INVALID_PASSWORD]: {
        status: 401,
        message: 'You entered the wrong password',
      },
      [store.validationErrors.GAME_NOT_FOUND]: {
        status: 404,
        message: 'That game does not exist',
      },
      [store.validationErrors.PLAYER_IN_GAME]: {
        status: 409,
        message: 'Player is already in a game',
      },
      defaultMessage: 'Something broke while attempting to fetch the game',
    }

    handleError({ response, state, err, options })
  }
})

/**
 * Receives
 *  gameType: String
 *  gameName: String
 *  password: String
 *
 * Responds
 *  201: OK
 *    id: String
 *  409: Conflict
 *    error: { message: 'Player is already in a game', code: 'playerInGame' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to create the game' }
 *
 *  400: Invalid info submitted (generic)
 *    error: { message: Missing or incorrectly formatted data, fields: { ... } }
 *  403: Unauthorized
 */
router.post('/', parseAndRefreshAuth, ({ request, response, state }) => {
  try {
    const {
      body: { gameType, gameName, password },
    } = request

    store.CreateGame({ gameType, gameName, password })

    response.body = {
      id: store.createGame({ gameType, gameName, password, username: state.username }),
    }
    response.status = 201
  } catch (err) {
    const options = {
      [store.validationErrors.PLAYER_IN_GAME]: {
        status: 409,
        message: 'Player is already in a game',
      },
      defaultMessage: 'Something broke while attempting to create the game',
    }

    handleError({ response, state, err, options })
  }
})

/**
 * Responds
 *  204: OK
 *  401: Unauthorized
 *    error: { message: "You don't have permission to do that", code: 'unauthorized' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to delete the game' }
 *
 *  403: Unauthorized
 */
router.delete('/:id', parseAndRefreshAuth, ({ response, state, captures: [id] }) => {
  try {
    store.deleteGame(id, state.username)

    response.status = 204
  } catch (err) {
    const options = {
      [store.validationErrors.UNAUTHORIZED]: {
        status: 401,
        message: "You don't have permission to do that",
      },
      defaultMessage: 'Something broke while attempting to delete the game',
    }

    handleError({ response, state, err, options })
  }
})

/**
 * Receives
 *  action: String
 *  data: { ... }
 *
 * Responds
 *  201: OK
 *    game: Game
 *  400: Invalid info submitted
 *    error: { message: "Invalid action", code: 'invalidAction' }
 *  401: Unauthorized
 *    error: { message: "You don't have permission to do that", code: 'unauthorized' }
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to submit your action' }
 *
 *  400: Invalid info submitted (generic)
 *    error: { message: Missing or incorrectly formatted data, fields: { ... } }
 *  403: Unauthorized
 */
router.post('/:id/action', parseAndRefreshAuth, ({ request, response, state, captures: [id] }) => {
  try {
    const {
      body: { action, data },
    } = request

    const ActionStruct = store.getGameStruct(id, action)
    ActionStruct({ data })

    store.submitAction({ id, username: state.username, action, data })

    response.body = { game: store.getGame({ id, username: state.username, isUserReq: false }) }
    response.status = 201
  } catch (err) {
    const options = {
      [store.validationErrors.INVALID_ACTION]: {
        status: 400,
        message: 'Invalid action',
      },
      [store.validationErrors.UNAUTHORIZED]: {
        status: 401,
        message: "You don't have permission to do that",
      },
      [store.validationErrors.GAME_NOT_FOUND]: {
        status: 404,
        message: 'That game does not exist',
      },
      defaultMessage: 'Something broke while attempting to submit your action',
    }

    handleError({ response, state, err, options })
  }
})

/**
 * Responds
 *  201: OK
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to mark you inactive' }
 *
 *  403: Unauthorized
 */
router.post(
  '/:id/inactivePlayer',
  parseAndRefreshAuth,
  async ({ response, state, captures: [id] }) => {
    try {
      store.markPlayerInactive(id, state.username)

      response.status = 201
    } catch (err) {
      const options = {
        [store.validationErrors.GAME_NOT_FOUND]: {
          status: 404,
          message: 'That game does not exist',
        },
        defaultMessage: 'Something broke while attempting to mark you inactive',
      }

      handleError({ response, state, err, options })
    }
  },
)

module.exports = router
