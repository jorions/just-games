'use strict'

const User = require('../UserModel')
const { createSaltAndHash } = require('../../../hash')
const { ValidationError } = require('../../../Errors')
const handleError = require('../../handleError')

const USERNAME_TAKEN = 'usernameTaken'

async function signUp({ username, password = '' }) {
  try {
    const existingUser = await User.findOne({ username }).exec()

    if (existingUser)
      throw new ValidationError('The given username is already in use', USERNAME_TAKEN)

    const { salt, hash } = await createSaltAndHash(password)

    const user = await User.create({
      username,
      password: {
        password: hash,
        salt,
      },
    })

    return user.toJSON()
  } catch (err) {
    handleError(err)
  }
}

module.exports = signUp

module.exports.validationErrors = {
  USERNAME_TAKEN,
}
