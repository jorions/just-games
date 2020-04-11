'use strict'

const cah = require('./cah')
const { gameNames } = require('../../../../shared/games')

module.exports = {
  [gameNames.CAH]: cah,
}
