import { connect } from 'react-redux'

import { gameNames } from 'shared/games'
import { confirmMessage } from 'models/message'

import styles from './styles.css'

import App from './App'

const styleMap = {
  [gameNames.CAH]: styles.cah,
}

const mapStateToProps = ({
  user: { username },
  message: { message, read },
  ui: {
    game: { game },
  },
}) => ({
  loggedIn: !!username,
  message,
  read,
  className: game ? styleMap[game.type] : '',
})

export default connect(mapStateToProps, { confirmMessage })(App)
