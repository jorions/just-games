'use strict'

const CustomError = require('./CustomError')

class DBError extends CustomError {
  constructor(err) {
    super(err.message, err)
    this.name = `DBError: ${err.name}`
  }
}

module.exports = DBError
