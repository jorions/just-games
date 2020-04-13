'use strict'

const struct = require('../../structs')

const SignUp = struct({
  username: 'shortStringWithContent',
  password: 'shortString',
  isCreate: 'boolean?',
})

module.exports = { SignUp }
