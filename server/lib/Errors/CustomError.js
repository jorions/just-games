'use strict'

class CustomError extends Error {
  constructor(message, errorParams = {}) {
    super(message)
    this.name = `CustomError${errorParams.name ? `: ${errorParams.name}` : ''}`
    Object.entries(errorParams).forEach(([key, value]) => {
      if (key === 'name') return
      this[key] = value
    })
  }
}

module.exports = CustomError
