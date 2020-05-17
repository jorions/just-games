'use strict'

const { buildServer } = require('effectsloop-server-utils')

const log = require('./log')
const routes = require('../routes')

const { SERVER_PORT } = process.env

const { app } = buildServer({
  log,
  routes,
  allowCors: true,
  port: SERVER_PORT,
})

module.exports = { app }
