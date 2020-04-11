'use strict'

const { Schema, connection } = require('mongoose')

const userSchema = new Schema({
  username: { type: String, required: true },
  password: {
    password: String,
    salt: String,
  },
  dateCreated: { type: Date, required: true, default: new Date() },
})

module.exports = connection.model('User', userSchema)
