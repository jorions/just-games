'use strict'

const cah = require('./cah')
const codenames = require('./codenames')
const { gameNames } = require('../../../../shared/games')

module.exports = {
  [gameNames.CAH]: cah,
  [gameNames.CODENAMES]: codenames,
}
