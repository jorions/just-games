'use strict'

const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env

const sign = data => jwt.sign(data, JWT_SECRET, { expiresIn: '10d' })

const verify = (log, token) =>
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

const parseAndRefreshIfNeeded = async (log, token) => {
  try {
    const data = await verify(log, token)
    return { token, data }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      log.info('Renewing expired token')
      const { iat, exp, ...data } = jwt.decode(token)
      const newToken = sign(data)
      return { token: newToken, data: { ...data, iat, exp } }
    }
    throw err
  }
}

module.exports = {
  sign,
  parseAndRefreshIfNeeded,
}
