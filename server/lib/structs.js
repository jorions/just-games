'use strict'

const { superstruct } = require('superstruct')

const { shortStringCharLimit } = require('../../shared/validations')

module.exports = superstruct({
  types: {
    shortStringWithContent: val =>
      typeof val === 'string' && val !== '' && val.length <= shortStringCharLimit,
    shortString: val => typeof val === 'string' && val.length <= shortStringCharLimit,
  },
})
