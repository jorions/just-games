'use strict'

const { ValidationError, DBError } = require('../Errors')

module.exports = err => {
  if (err instanceof ValidationError) throw err
  throw new DBError(err)
}
