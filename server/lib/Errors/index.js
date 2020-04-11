'use strict'

const CustomError = require('./CustomError')
const DBError = require('./DBError')
const ValidationError = require('./ValidationError')

module.exports = {
  CustomError,
  ValidationError,
  DBError,
}
