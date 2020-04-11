'use strict'

const axios = require('axios')

const { SERVER_APP_NAME } = process.env

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'App-Name': SERVER_APP_NAME,
  },
}

const instance = axios.create(defaultOptions)

module.exports = instance
