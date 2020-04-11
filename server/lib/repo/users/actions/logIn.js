'use strict'

const User = require('../UserModel')
const { compare } = require('../../../hash')
const { ValidationError } = require('../../../Errors')
const handleError = require('../../handleError')

const INVALID_CREDENTIALS = 'invalidCredentials'

async function logIn({ username, password }) {
  try {
    const user = await User.findOne({ username }).exec()

    if (!user)
      throw new ValidationError('The given username is already in use', INVALID_CREDENTIALS)

    const {
      password: { password: hashedPassword },
    } = user
    const match = await compare(password, hashedPassword)

    if (!match)
      throw new ValidationError(
        'The email and password combination does not exist',
        INVALID_CREDENTIALS,
      )

    return user.toJSON()
  } catch (err) {
    handleError(err)
  }
}

module.exports = logIn

module.exports.validationErrors = {
  INVALID_CREDENTIALS,
}
