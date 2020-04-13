'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const { users } = require('../lib/repo')
const jwt = require('../lib/jwt')

const router = buildRouter('/api/users')

/**
 * Receives
 *  username: String
 *  password: String
 *  isCreate: Boolean
 *
 * Responds
 *  200: OK
 *    newToken: JWT
 *  401: Invalid login
 *    error: { message: 'The email and password combination does not exist', code: 'invalidCredentials' }
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
    const { username, password, isCreate } = request.body

    users.SignUp({ username, password, isCreate })

    if (isCreate) await users.signUp({ username, password })
    else await users.logIn({ username, password })

    response.status = 200
    response.body = { newToken: jwt.sign({ username }) }
  } catch (err) {
    const options = {
      [users.logIn.validationErrors.INVALID_CREDENTIALS]: {
        status: 401,
        message: 'The email and password combination does not exist',
      },
      [users.signUp.validationErrors.USERNAME_TAKEN]: {
        status: 409,
        message: 'That username is already in use',
      },
      defaultMessage: 'Something broke while attempting to log in',
    }

    handleError({ response, state, err, options })
  }
})

module.exports = router
