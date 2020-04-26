import { connect } from 'react-redux'

import CAH from './CAH'

const mapStateToProps = ({
  ui: {
    game: {
      game: { status, czar, prompt, playedCardsThisRound, yourCards, remainingSwaps, players },
      submitActionLoading,
    },
  },
  user: { username },
}) => ({
  status,
  czar,
  prompt,
  playedCardsThisRound,
  yourCards,
  remainingSwaps,
  players,
  username,
  isCzar: czar === username,
  submitActionLoading,
})

export default connect(mapStateToProps)(CAH)
