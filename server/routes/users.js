'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')
const jwt = require('../lib/jwt')
const { parseAndVerify } = require('../lib/jwt')

const router = buildRouter('/api/users')

/**
 * Receives
 *  username: String
 *
 * Responds
 *  200: OK
 *  409: Account already exists
 *    error: { message: 'That username is already in use', code: 'accountTaken' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to log in' }
 *
 *  400: Invalid info submitted (generic)
 *    error: { message: Missing or incorrectly formatted data, fields: { ... } }
 */
router.post('/logIn', async ({ request, response, state }) => {
  try {
    const { username } = request.body

    store.LogIn({ username })
    const id = store.logIn(username)

    response.status = 200
    // This is the logic used by our middleware for refreshing a token
    response.set('New-Token', jwt.sign({ username, id }))
    response.set('Access-Control-Expose-Headers', 'New-Token')
  } catch (err) {
    const options = {
      [store.validationErrors.ACCOUNT_TAKEN]: {
        status: 409,
        message: 'That username is already in use',
      },
      defaultMessage: 'Something broke while attempting to log in',
    }

    handleError({ response, state, err, options })
  }
})

/**
 * Receives
 *  token: String
 *  gameId: String (optional)
 *
 * Responds
 *  201: OK
 *  404: Not found
 *    error: { message: 'That game does not exist', code: 'gameNotFound' }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to log you out' }
 *
 *  403: Unauthorized
 */
router.post('/logOut', async ({ request, response, state }) => {
  try {
    const {
      body: { token, gameId },
    } = request

    const { username } = await parseAndVerify(state.log, token)

    store.removeUser(username, gameId)

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
