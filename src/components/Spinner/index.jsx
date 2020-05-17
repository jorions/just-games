import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

const Spinner = ({ size, color }) =>
  color === 'primary' || color === 'secondary' ? (
    <CircularProgress size={size} color={color} />
  ) : (
    <CircularProgress size={size} classes={{ root: `color: ${color}` }} />
  )

Spinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'black', 'white']),
}

Spinner.defaultProps = {
  size: 40,
  color: 'primary',
}

export default Spinner
