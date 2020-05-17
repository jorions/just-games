import { connect } from 'react-redux'

import { gameNames, games } from 'shared/games'
import { fetchGame, deleteGame, submitAction, clearErrors, reset } from 'models/ui/game'
import style from 'lib/style'

import Game from './Game'

import styles from './styles.css'

const codenames = games[gameNames.CODENAMES]

const styleMap = {
  [gameNames.CAH]: () => styles.cah,
  [gameNames.CODENAMES]: ({ playerTeam }) =>
    style({
      [styles.codenames]: true,
      [styles.red]: playerTeam === codenames.values.RED,
      [styles.blue]: playerTeam === codenames.values.BLUE,
    }),
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
  className: game ? styleMap[game.type](game) : '',
})

export default connect(mapStateToProps, (dispatch, props) => ({
  fetchGame: (password, onSuccess) => {
    const { id } = props
    dispatch(fetchGame({ id, password, onSuccess }))
  },
  deleteGame: () => {
    const { id } = props
    dispatch(deleteGame(id))
  },
  submitAction: (action, data, onSuccess) => {
    const { id } = props
    dispatch(submitAction({ id, action, data, onSuccess }))
  },
  reset: () => {
    const { id } = props
    dispatch(reset(id))
  },
  clearErrors: () => {
    dispatch(clearErrors())
  },
}))(Game)
