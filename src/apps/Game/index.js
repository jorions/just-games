import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { gameNames } from 'shared/games'
import { fetchGame, deleteGame, submitAction, clearErrors, reset } from 'models/ui/game'

import Game from './Game'

import styles from './styles.css'

const styleMap = {
  [gameNames.CAH]: styles.cah,
}

const mapStateToProps = ({
  ui: {
    game: {
      game,
      fetchGameLoading,
      fetchGameError,
      deleteGameLoading,
      deleteGameError,
      deleteGameSuccess,
      gameNotFound,
      invalidPassword,
      playerInGame,
      pollingError,
      submitActionError,
      gameEnded,
    },
  },
  user: { username },
}) => ({
  type: game && game.type,
  name: (game && game.name) || '',
  isOwner: !!(game && game.owner && game.owner === username),
  fetchGameLoading,
  fetchGameError,
  deleteGameLoading,
  deleteGameError,
  deleteGameSuccess,
  gameNotFound,
  invalidPassword,
  playerInGame,
  gameEnded,
  pollingError,
  submitActionError,
  className: game ? styleMap[game.type] : '',
})

export default withRouter(
  connect(mapStateToProps, (dispatch, props) => ({
    fetchGame: (password, onSuccess) => {
      const {
        match: {
          params: { id },
        },
      } = props
      dispatch(fetchGame({ id, password, onSuccess }))
    },
    deleteGame: () => {
      const {
        match: {
          params: { id },
        },
      } = props
      dispatch(deleteGame(id))
    },
    submitAction: (action, data, onSuccess) => {
      const {
        match: {
          params: { id },
        },
      } = props
      dispatch(submitAction({ id, action, data, onSuccess }))
    },
    reset: () => {
      dispatch(reset())
    },
    clearErrors: () => {
      dispatch(clearErrors())
    },
  }))(Game),
)
