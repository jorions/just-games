import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { gameNames } from 'shared/games'
import { logOut } from 'models/globalActions'

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
  className: game ? styleMap[game.type] : '',
})

export default withRouter(connect(mapStateToProps, { logOut })(Nav))
