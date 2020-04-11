import { PureComponent } from 'react'
import PropTypes from 'prop-types'

class KeyPressListener extends PureComponent {
  componentDidMount() {
    document.addEventListener('keypress', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeyPress)
  }

  handleKeyPress = evt => {
    const { enterKey, onKeyPress } = this.props
    if (enterKey && evt.key === 'Enter') onKeyPress(evt)
  }

  render() {
    return null
  }
}

KeyPressListener.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  enterKey: PropTypes.bool,
}

KeyPressListener.defaultProps = {
  enterKey: false,
}

export default KeyPressListener
