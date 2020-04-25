import { connect } from 'react-redux'

import { gameNames } from 'shared/games'
import { logOut } from 'models/globalActions'
import { markPlayerInactive } from 'models/ui/game'

import Nav from './Nav'

import styles from './styles.css'

const styleMap = {
  [gameNames.CAH]: styles.cah,
}

const mapStateToProps = ({
  user: { username },
  ui: {
    game: { game },
  },
}) => ({
  loggedIn: !!username,
  game,
  className: game ? styleMap[game.type] : '',
})

export default connect(mapStateToProps, (dispatch, ownProps) => ({
  logOut: () => {
    // TODO: Fix this (currently 403s)
    if (ownProps.game) markPlayerInactive(ownProps.game.id)
    dispatch(logOut())
  },
}))(Nav)
