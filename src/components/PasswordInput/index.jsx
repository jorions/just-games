import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'

import TextInput from 'components/TextInput'

class PasswordInput extends PureComponent {
  state = { showPassword: false }

  toggleShowPassword = () => {
    this.setState(({ showPassword }) => ({ showPassword: !showPassword }))
  }

  render() {
    const { name, value, placeholder, label, error, onChange } = this.props
    const { showPassword } = this.state

    const inputType = showPassword ? 'input' : 'password'

    return (
      <TextInput
        type={inputType}
        name={name}
        value={value}
        placeholder={placeholder}
        label={label}
        error={error}
        inputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button className="mt-2" color="primary" onClick={this.toggleShowPassword}>
                <i className={`far fa-eye${showPassword ? '' : '-slash'} fa-2x`} />
              </Button>
            </InputAdornment>
          ),
        }}
        fullWidth
        onChange={onChange}
      />
    )
  }
}

PasswordInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

PasswordInput.defaultProps = {
  name: 'password',
  placeholder: 'Password',
  label: 'Password',
  error: false,
}

export default PasswordInput
