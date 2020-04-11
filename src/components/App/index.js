import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { gameNames } from 'shared/games'

import styles from './styles.css'

import App from './App'

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

export default withRouter(connect(mapStateToProps)(App))
