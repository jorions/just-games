'use strict'

const jwt = require('jsonwebtoken')

const store = require('./store')

const { JWT_SECRET } = process.env

// Use 1 day as this is the length of time we wait to delete someone
const sign = data => jwt.sign(data, JWT_SECRET, { expiresIn: '1d' })

const parseAndVerify = (log, token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        log.warn(`The following token failed validation: ${token}`)
        reject(err)
      } else {
        // If a user A logs in, then goes inactive, and user B then logs in with the same
        // username, we can ensure that if user A returns, they will be logged out by
        // storing the username with a unique id, and comparing the token vs the store.
        const { username, id } = decoded
        if (!store.userIsValid(username, id)) {
          log.warn(`The following token has an id mismatch: ${token}`)
          reject(new Error('username/id mismatch'))
        }
        resolve(decoded)
      }
    })
  })

const REFRESH_WINDOW_IN_MS = 1000 * 60 * 60 * 2 // 2h

const parseAndRefreshIfNeeded = async (log, token) => {
  const data = await parseAndVerify(log, token)
  const { exp: expInSec, iat: unusedIat, ...relevantData } = data
  if (expInSec * 1000 - Date.now() < REFRESH_WINDOW_IN_MS) {
    const newToken = sign(relevantData)
    const { iat, exp } = jwt.decode(newToken)
    return { token: newToken, data: { ...relevantData, iat, exp } }
  }
  return { token, data }
}

module.exports = {
  sign,
  parseAndVerify,
  parseAndRefreshIfNeeded,
}
