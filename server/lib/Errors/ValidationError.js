'use strict'

const CustomError = require('./CustomError')

class ValidationError extends CustomError {
  constructor(message, code) {
    super(message, { code })
    this.name = 'ValidationError'
  }
}

module.exports = ValidationError
