'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')

const router = buildRouter('/api/message')

/**
 * Receives
 *  message: String
 *  password: String
 *
 * Responds
 *  201: OK
 *  500: Server error
 *    error: { message: 'Something broke while attempting to set the message' }
 */
router.post('/', async ({ request, response, state }) => {
  const INVALID_PASSWORD = 'invalidPassword'
  try {
    const { message, password } = request.body

    if (password !== process.env.MESSAGE_PASSWORD) {
      const err = new Error()
      err.code = INVALID_PASSWORD
      throw err
    }

    store.setMessage(message)

    response.status = 201
  } catch (err) {
    const options = {
      [INVALID_PASSWORD]: {
        status: 500,
        message: 'Something broke while attempting to set the message',
        noCode: true,
      },
      defaultMessage: 'Something broke while attempting to set the message',
    }

    handleError({ response, state, err, options })
  }
})

module.exports = router
