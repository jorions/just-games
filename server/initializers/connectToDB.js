'use strict'

const mongoose = require('mongoose')

const { DB_USER, DB_PW, DB_URL, DB_PORT, DB_NAME, NODE_ENV } = process.env

const dbUrl =
  DB_USER && DB_PW
    ? `mongodb://${DB_USER}:${DB_PW}@${DB_URL}:${DB_PORT}/${DB_NAME}?authSource=admin`
    : `mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`

module.exports = log =>
  new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, autoIndex: NODE_ENV === 'development' })
    const db = mongoose.connection

    db.on('error', err => {
      log.error({ err }, 'Connection error')
      reject()
    })

    db.on('open', () => {
      log.info('Connected to the DB!')
      resolve()
    })
  })
