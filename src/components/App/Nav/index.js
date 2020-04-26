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
    if (ownProps.game) markPlayerInactive(ownProps.game.id, true)
    setTimeout(() => dispatch(logOut()), 0) // Wait until the next cycle to remove user
  },
}))(Nav)
