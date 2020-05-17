import { connect } from 'react-redux'

import Codenames from './Codenames'

const mapStateToProps = ({
  ui: {
    game: {
      game: {
        owner,
        status,
        red,
        blue,
        board,
        spyLayout,
        players,
        playerTeam,
        playerTeamIsPlaying,
        playerTeamData,
        playerVote,
        teamIsVoting,
      },
      submitActionLoading,
    },
  },
  user: { username },
}) => {
  return {
    owner,
    status,
    red,
    blue,
    board,
    spyLayout,
    players,
    playerTeam,
    playerTeamIsPlaying,
    playerTeamData,
    playerVote,
    teamIsVoting,
    username,
    isOwner: username === owner,
    submitActionLoading,
  }
}

export default connect(mapStateToProps)(Codenames)
