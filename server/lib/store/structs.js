'use strict'

const struct = require('../structs')

const CreateGame = struct({
  gameType: 'string',
  gameName: 'shortStringWithContent',
  password: 'shortString?',
})

module.exports = { CreateGame }
