'use strict'

const struct = require('../structs')

const LogIn = struct({
  username: 'shortStringWithContent',
})

const CreateGame = struct({
  gameType: 'string',
  gameName: 'shortString',
  password: 'shortString',
})

module.exports = { LogIn, CreateGame }
