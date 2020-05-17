import React from 'react'
import PropTypes from 'prop-types'
import MCard from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'

import style from 'lib/style'
import { gameNames, games } from 'shared/games'

import styles from './styles.css'

const {
  values: { RED, BLUE, BLACK, TAN },
} = games[gameNames.CODENAMES]

const colorMap = {
  [RED]: 'red',
  [BLUE]: 'blue',
  [BLACK]: 'black',
  [TAN]: 'tan',
}

const sizeMap = {
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
}

const Card = ({
  text,
  color,
  hidden,
  isSpymaster,
  selected,
  canSelect,
  voted,
  playerVote,
  conflict,
  onClick,
}) => (
  <MCard
    styleName={style({
      card: true,
      outline: isSpymaster,
      fill: !hidden,
      [colorMap[color]]: color,
      voted,
      playerVote,
      conflict,
    })}
  >
    {canSelect ? (
      <CardActionArea
        key={text}
        onClick={onClick}
        classes={{ focusHighlight: styles.focusHighlight }}
      >
        <Typography
          variant="h6"
          styleName={style({
            text: true,
            [sizeMap[text.length]]: sizeMap[text.length],
            selected,
          })}
        >
          {text}
        </Typography>
      </CardActionArea>
    ) : (
      <Typography
        key={text}
        variant="h6"
        styleName={style({
          text: true,
          [sizeMap[text.length]]: sizeMap[text.length],
          selected,
        })}
      >
        {text}
      </Typography>
    )}
  </MCard>
)

Card.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string, // RED, BLUE, BLACK, TAN, null
  hidden: PropTypes.bool.isRequired,
  isSpymaster: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  canSelect: PropTypes.bool.isRequired,
  voted: PropTypes.bool.isRequired,
  playerVote: PropTypes.bool.isRequired,
  conflict: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

Card.defaultProps = {
  color: null,
  onClick: () => {},
}

export default Card
