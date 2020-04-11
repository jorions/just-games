'use strict'

const { buildServer } = require('effectsloop-server-utils')

const { initialize } = require('./store')
const connectToDB = require('../initializers/connectToDB')
const routes = require('../routes')

const { SERVER_PORT } = process.env

const { app } = buildServer({
  name: 'games',
  routes,
  allowCors: true,
  port: SERVER_PORT,
  beforeStartup: logger => Promise.all([initialize(), connectToDB(logger)]),
})

module.exports = { app }
