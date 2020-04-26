'use strict'

const struct = require('../../../structs')
const { gameNames, games } = require('../../../../../shared/games')

const { actions } = games[gameNames.CAH]

module.exports = {
  [actions.SUBMIT_CARDS]: struct({ data: ['string'] }), // playedCards
  [actions.PICK_WINNER]: struct({ data: 'number' }), // pickedWinnerIdx
  [actions.SWAP_CARDS]: struct({ data: ['string'] }), // swappedCards
}
