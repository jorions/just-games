import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

import './styles.css'

const Header = ({ title, className }) => (
  <div styleName="header" className={className}>
    <Typography variant="h3" className="mt-2">
      {title}
    </Typography>
  </div>
)

Header.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

export default Header
