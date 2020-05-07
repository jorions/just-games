'use strict'

const randomString = len => {
  let str = Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substr(1, len)
    .toUpperCase()

  if (str.length < len) str += randomString(len - str.length)

  return str
}

module.exports = len => {
  let str = Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substr(1, len)
    .toUpperCase()

  if (str.length < len) str += randomString(len - str.length)

  return str
}
