import { connect } from 'react-redux'

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

export default connect(mapStateToProps)(App)
