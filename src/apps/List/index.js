import { connect } from 'react-redux'

import { fetchGames, createGame, clearErrors, reset } from 'models/ui/list'

import List from './List'

const mapStateToProps = ({
  ui: {
    list: { games, fetchGamesLoading, fetchGamesError, newGameId, createGameError, playerInGame },
  },
}) => ({
  games,
  fetchGamesLoading,
  fetchGamesError,
  newGameId,
  createGameError,
  playerInGame,
})

export default connect(mapStateToProps, { fetchGames, createGame, clearErrors, reset })(List)
