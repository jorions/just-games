import { connect } from 'react-redux'

import { gameNames, games } from 'shared/games'
import style from 'lib/style'

import Header from './Header'

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
    game: { game },
  },
}) => ({
  className: game ? styleMap[game.type](game) : '',
})

export default connect(mapStateToProps)(Header)
