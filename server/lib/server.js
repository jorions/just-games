'use strict'

const { buildServer } = require('effectsloop-server-utils')

const routes = require('../routes')

const { SERVER_PORT } = process.env

const { app } = buildServer({
  name: 'games',
  routes,
  allowCors: true,
  port: SERVER_PORT,
})

module.exports = { app }
