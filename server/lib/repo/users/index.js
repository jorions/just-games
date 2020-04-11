'use strict'

const logIn = require('./actions/logIn')
const signUp = require('./actions/signUp')
const structs = require('./structs')

module.exports = {
  logIn,
  signUp,
  ...structs,
}
