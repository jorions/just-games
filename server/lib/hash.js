'use strict'

const bcrypt = require('bcrypt')

const SALT_ROUNDS = 10

const createSaltAndHash = async str => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hash = await bcrypt.hash(str, salt)
  return { salt, hash }
}

const compare = async (str, hash) => {
  const match = await bcrypt.compare(str, hash)
  return match
}

module.exports = {
  createSaltAndHash,
  compare,
}
