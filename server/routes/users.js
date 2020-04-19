'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')
const jwt = require('../lib/jwt')

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
router.post('/log-in', async ({ request, response, state }) => {
  try {
    const { username } = request.body

    store.LogIn({ username })
    store.logIn(username)

    response.status = 200
    // This is the logic used by our middleware for refreshing a token
    response.set('New-Token', jwt.sign({ username }))
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

module.exports = router
