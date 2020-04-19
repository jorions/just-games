'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')

const { parseAndRefreshAuth } = require('./middleware')

const router = buildRouter('/api/games')

/**
 * Responds
 *  200: OK
 *    games: [Game]
 *  500: Server error
 *    error: { message: 'Something broke while attempting to fetch games' }
 */
router.get('/', parseAndRefreshAuth, ({ response, state }) => {
  try {
    response.body = { games: store.getGames(state.username) }
    response.status = 200
  } catch (err) {
    handleError({ response, state, err, msg: 'Something broke while attempting to fetch games' })
  }
})

/**
 * Responds
 *  200: OK
 *    game: Game
 *  401: Unauthorized
 *    error: { message: 'You entered the wrong password', code: 'invalidPassword' }
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  409: Conflict
 *    error: { message: 'Player is already in a game', code: 'playerInGame' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to fetch the game' }
 */
router.get('/:id', parseAndRefreshAuth, ({ request, response, state, captures: [id] }) => {
  try {
    const {
      query: { password },
    } = request

    state.responseBodyMaxLoggingLen = 10 // eslint-disable-line no-param-reassign

    response.body = {
      game: store.getGame({ id, password, username: state.username }),
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
 *  401: Unauthorized
 *    error: { message: "You don't have permission to do that", code: 'unauthorized' }
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to submit your action' }
 *
 *  400: Invalid info submitted (generic)
 *    error: { message: Missing or incorrectly formatted data, fields: { ... } }
 */
router.post('/:id/action', parseAndRefreshAuth, ({ request, response, state, captures: [id] }) => {
  try {
    const {
      body: { action, data },
    } = request

    // TODO: Validate input

    store.submitAction({ id, username: state.username, action, data })

    response.body = { game: store.getGame({ id, username: state.username }) }
    response.status = 201
  } catch (err) {
    const options = {
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
 */
router.post('/:id/inactivePlayer', parseAndRefreshAuth, ({ response, state, captures: [id] }) => {
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
})

module.exports = router
