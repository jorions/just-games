import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

const currentYear = new Date().getFullYear()
export const YEARS = ['']
for (let i = 0; i <= 100; i += 1) {
  YEARS.push(currentYear - i)
}

const Dropdown = ({ className, name, value, id, label, options, error, years, onChange }) => (
  <FormControl className={className} error={error}>
    {label && <InputLabel htmlFor={id || `dropdown_${name}`}>{label}</InputLabel>}
    <Select
      value={value}
      onChange={onChange}
      input={<Input name={name} id={id || `dropdown_${name}`} />}
    >
      {(years ? YEARS : options).map(option =>
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
  years: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

Dropdown.defaultProps = {
  className: 'w-100',
  id: null,
  label: null,
  options: [],
  error: null,
  years: false,
}

export default Dropdown
