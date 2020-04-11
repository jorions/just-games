'use strict'

const { handleError } = require('effectsloop-server-utils')
const { StructError } = require('superstruct')

const { DBError } = require('../lib/Errors')

module.exports = ({ response, state, err, msg, options }) => {
  if (err instanceof DBError) {
    response.status = 500
    response.body = { error: { message: 'An error occured in the DB', code: 'dbError' } }
    state.err = err // eslint-disable-line no-param-reassign
    return
  }

  handleError({ response, state, err, msg, options, StructError })
}
