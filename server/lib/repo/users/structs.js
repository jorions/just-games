'use strict'

const struct = require('../../structs')

const SignUp = struct({
  username: 'shortStringWithContent',
  password: 'shortStringWithContent',
  isCreate: 'boolean?',
})

module.exports = { SignUp }
