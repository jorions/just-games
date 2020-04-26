'use strict'

const { buildRouter } = require('effectsloop-server-utils')

const handleError = require('./handleError')
const store = require('../lib/store')
const { validateAdmin } = require('./middleware')

const router = buildRouter('/api/admin')

/**
 * Receives
 *  message: String
 *  password: String (middleware handles)
 *
 * Responds
 *  201: OK
 *  500: Server error
 *    error: { message: 'Something broke while attempting to set the message' }
 *
 *  403: Unauthorized
 */
router.post('/message', validateAdmin, async ({ request, response, state }) => {
  try {
    const { message } = request.body

    store.setMessage(message)

    response.status = 201
  } catch (err) {
    handleError({
      response,
      state,
      err,
      msg: 'Something broke while attempting to set the message',
    })
  }
})

/**
 * Receives
 *  password: String (middleware handles)
 *
 * Responds
 *  200: OK
 *    games: { data, totalCount }, users: { data, totalCount }
 *  500: Server error
 *    error: { message: 'Something broke while attempting to get the data' }
 *
 *  403: Unauthorized
 */
router.post('/overview', validateAdmin, async ({ response, state }) => {
  try {
    response.body = store.getOverview()
    response.status = 200
  } catch (err) {
    handleError({ response, state, err, msg: 'Something broke while attempting to get the data' })
  }
})

module.exports = router
