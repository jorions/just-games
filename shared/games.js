'use strict'

const CAH = 'Cards Against Humanity'

module.exports = {
  gameNames: {
    CAH,
  },
  games: {
    [CAH]: {
      statuses: {
        PICKING_WINNER: 'pickingWinner',
        PLAYERS_SUBMITTING: 'playersSubmitting',
        WINNER: 'winner',
      },
      actions: {
        SUBMIT_CARDS: 'submitCards',
        PICK_WINNER: 'pickWinner',
      },
    },
  },
}
