import { connect } from 'react-redux'

import { gameNames } from 'shared/games'

import Header from './Header'

import styles from './styles.css'

const styleMap = {
  [gameNames.CAH]: styles.cah,
}

const mapStateToProps = ({
  ui: {
    game: { game },
  },
}) => ({
  className: game ? styleMap[game.type] : '',
})

export default connect(mapStateToProps)(Header)
