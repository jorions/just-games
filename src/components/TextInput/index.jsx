import React from 'react'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'

const TextInput = ({
  type,
  className,
  name,
  value,
  id,
  placeholder,
  label,
  inputProps,
  error,
  helperText,
  fullWidth,
  disabled,
  margin,
  onChange,
}) => (
  <TextField
    type={type}
    className={className}
    name={name}
    value={value}
    id={id || name}
    placeholder={placeholder}
    label={label}
    helperText={helperText}
    InputProps={inputProps}
    error={error}
    fullWidth={fullWidth}
    disabled={disabled}
    margin={margin}
    onChange={onChange}
  />
)

TextInput.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  inputProps: PropTypes.shape(),
  error: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  margin: PropTypes.oneOf(['none', 'normal', 'dense']),
  onChange: PropTypes.func.isRequired,
}

TextInput.defaultProps = {
  type: 'text',
  className: null,
  id: null,
  placeholder: '',
  label: null,
  helperText: null,
  inputProps: null,
  error: null,
  margin: 'normal',
  fullWidth: false,
  disabled: false,
}

export default TextInput
