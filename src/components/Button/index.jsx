import React from 'react'
import PropTypes from 'prop-types'
import MButton from '@material-ui/core/Button'

import Spinner from 'components/Spinner'

const Button = ({ loading, spinnerColor, spinnerSize, spinnerClasses, ...otherProps }) =>
  loading ? (
    <div className={`inline-block center ${spinnerClasses}`}>
      <Spinner color={spinnerColor} size={spinnerSize} />
    </div>
  ) : (
    <MButton {...otherProps} />
  )

Button.propTypes = {
  loading: PropTypes.bool,
  spinnerColor: PropTypes.oneOf(['primary', 'secondary', 'black', 'white']),
  spinnerSize: PropTypes.number,
  spinnerClasses: PropTypes.number,
}

Button.defaultProps = {
  loading: false,
  spinnerColor: 'primary',
  spinnerSize: 28,
  spinnerClasses: 'pt1',
}

export default Button
