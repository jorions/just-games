'use strict'

const shuffle = require('./shuffle')

module.exports = arr => shuffle([...Array(arr.length).keys()])
