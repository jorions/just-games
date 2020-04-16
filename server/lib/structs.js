'use strict'

const { superstruct } = require('superstruct')

const { shortStringCharLimit } = require('../../shared/validations')

module.exports = superstruct({
  types: {
    shortStringWithContent: val => {
      if (typeof val !== 'string') return `Expected a string but received a ${typeof val}`
      if (val === '') return 'Expected the string to have content'
      if (val.length > shortStringCharLimit)
        return `Expected string to be < ${shortStringCharLimit} chars long`
      return true
    },
    shortString: val => {
      if (typeof val !== 'string') return `Expected a string but received a ${typeof val}`
      if (val.length > shortStringCharLimit)
        return `Expected string to be < ${shortStringCharLimit} chars long`
      return true
    },
  },
})
