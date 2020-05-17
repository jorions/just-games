'use strict'

const CAH = 'Cards Against Humanity'
const CODENAMES = 'Codenames'

module.exports = {
  gameNames: {
    CAH,
    CODENAMES,
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
        SWAP_CARDS: 'swapCards',
      },
    },
    [CODENAMES]: {
      statuses: {
        // null
        STARTING: 'starting',
        // null
        GIVING_HINT: 'givingHint',
        // { hint, cap, count, votes: [{ x, y }, ...] }
        VOTING: 'voting',
        // { hint, cap, count, vote: { x, y }, pickedRightTeam, pickedWrongTeam }
        VOTED: 'voted',
        // RED \ BLUE
        WINNER: 'winnner',
      },
      actions: {
        CHOOSE_TEAM: 'chooseTeam',
        START_GAME: 'startGame',
        GIVE_HINT: 'giveHint',
        VOTE: 'vote',
        END_ROUND: 'endRound',
      },
      values: {
        RED: 'red',
        BLUE: 'blue',
        BLACK: 'black',
        TAN: 'tan',
      },
    },
  },
}
