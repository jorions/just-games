import { connect } from 'react-redux'

import { gameNames } from 'shared/games'

import Header from './Header'

import styles from './styles.css'

const styleMap = {
  [gameNames.CAH]: ({ game, username }) =>
    game.owner === username ? `${styles.cah} ${styles.owner}` : styles.cah,
}

const mapStateToProps = ({
  ui: {
    game: { game },
  },
  user: { username },
}) => ({
  className: game ? styleMap[game.type]({ game, username }) : '',
})

export default connect(mapStateToProps)(Header)
