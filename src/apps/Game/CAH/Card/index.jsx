import React from 'react'
import PropTypes from 'prop-types'
import MCard from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'

import style from 'lib/style'

import styles from './styles.css'

const Card = ({ id, text, selected, canSelect, small, onClick }) => (
  <MCard styleName={style({ card: true, small })}>
    {canSelect ? (
      <CardActionArea
        key={id}
        onClick={onClick}
        classes={{ focusHighlight: styles.focusHighlight }}
      >
        <Typography
          variant="body1"
          className={style({
            [styles.text]: true,
            [styles.long]: text.length > 125,
            [styles.selected]: selected,
          })}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {selected && (
          <div styleName="count">
            <Typography variant="h1" classes={{ h1: styles.countText }}>
              {selected}
            </Typography>
          </div>
        )}
      </CardActionArea>
    ) : (
      <div key={id}>
        <Typography
          variant="body1"
          className={style({
            [styles.text]: true,
            [styles.long]: text.length > 125,
            [styles.selected]: selected,
          })}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    )}
  </MCard>
)

Card.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  selected: PropTypes.number,
  canSelect: PropTypes.bool.isRequired,
  small: PropTypes.bool,
  onClick: PropTypes.func,
}

Card.defaultProps = {
  small: false,
  selected: 0,
  onClick: () => {},
}

export default Card
