'use strict'

const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env

// Use 1 day as this is the length of time we wait for someone to be inactive
const sign = data => jwt.sign(data, JWT_SECRET, { expiresIn: '1d' })

const parseAndVerify = (log, token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        log.warn(`The following token failed validation: ${token}`)
        reject(err)
      } else {
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
