import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'
import Button from '@material-ui/core/Button'

import * as routes from 'routes'

import styles from './styles.css'

// When passed as the 'component' prop into <Button> it must be able to hold a ref,
// but pure functional components are stateless and thus cannot hold a ref.
// So instead it must be a class.
class FormattedLink extends PureComponent {
  render() {
    return (
      <Link
        getProps={({ isCurrent }) => (isCurrent ? { className: [styles.active] } : {})}
        {...this.props}
      />
    )
  }
}

const renderLink = (to, icon, text, styleName = '', onClick = () => {}) => (
  <Button component={FormattedLink} to={to} styleName={styleName} onClick={onClick}>
    <div className="w4 inline-block">
      <i className={`hide-on-mobile fas fa-${icon}`} />
      <i styleName="mobileIcon" className={`hide-on-desktop fas fa-${icon} flex-centered mb1`} />
    </div>
    <span styleName="label">{text}</span>
  </Button>
)

const Nav = ({ loggedIn, className, logOut }) => (
  <div styleName="nav" className={className}>
    {loggedIn && renderLink('/', 'home', 'Games')}
    {!loggedIn && renderLink(routes.logIn, 'sign-in-alt', 'Log In')}
    {loggedIn && renderLink(routes.logOut, 'sign-out-alt', 'Log Out', 'logOut', logOut)}
  </div>
)

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  logOut: PropTypes.func.isRequired,
}

export default Nav
