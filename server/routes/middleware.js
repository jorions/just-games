'use strict'

const { parseAndRefreshIfNeeded } = require('../lib/jwt')

module.exports = {
  parseAndRefreshAuth: async (ctx, next) => {
    const {
      request: {
        headers: { authorization },
      },
      state: { log },
    } = ctx

    let newToken
    let username
    try {
      const parsed = await parseAndRefreshIfNeeded(log, authorization)
      newToken = parsed.token
      username = parsed.data.username
    } catch (err) {
      ctx.state.warning = 'Token failed validation'
      ctx.response.status = 403 // Don't use this response anywhere else or the user will be logged out
      return
    }

    ctx.state.username = username

    await next()

    // If its a good response and token got refreshed, add to response headers
    if (ctx.response.status < 300 && newToken !== authorization) {
      ctx.response.set('New-Token', newToken)
      ctx.response.set('Access-Control-Expose-Headers', 'New-Token') // Allows CORS requests to keep this header
    }
  },
  validateAdmin: (ctx, next) => {
    const {
      request: {
        body: { password },
      },
    } = ctx

    if (password !== process.env.ADMIN_PASSWORD) {
      ctx.state.warning = 'Invalid admin password'
      ctx.response.status = 403
      return
    }

    next()
  },
}
