import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

const Dropdown = ({ className, name, value, id, label, options, error, inputProps, onChange }) => (
  <FormControl className={className} error={error}>
    {label && <InputLabel htmlFor={id || `dropdown_${name}`}>{label}</InputLabel>}
    <Select
      value={value}
      onChange={onChange}
      input={<Input name={name} id={id || `dropdown_${name}`} {...inputProps} />}
    >
      {options.map(option =>
        typeof option === 'object' ? (
          <MenuItem key={`dropdown_${name}_${option.value}`} value={option.value}>
            {option.display}
          </MenuItem>
        ) : (
          <MenuItem key={`dropdown_${name}_${option}`} value={option}>
            {option}
          </MenuItem>
        ),
      )}
    </Select>
  </FormControl>
)

Dropdown.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        display: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.string,
      PropTypes.number,
    ]),
  ),
  error: PropTypes.bool,
  inputProps: PropTypes.shape(),
  onChange: PropTypes.func.isRequired,
}

Dropdown.defaultProps = {
  className: 'w-100',
  id: null,
  label: null,
  options: [],
  error: null,
  inputProps: {},
}

export default Dropdown
