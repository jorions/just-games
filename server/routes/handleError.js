'use strict'

const { handleError } = require('effectsloop-server-utils')
const { StructError } = require('superstruct')

module.exports = ({ response, state, err, msg, options }) => {
  handleError({ response, state, err, msg, options, StructError })
}
