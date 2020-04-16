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
      ctx.response.status = 401
      return
    }

    ctx.state.username = username

    await next()

    // If its a good response and token got refreshed, add to body
    if (ctx.response.status > 300 && newToken !== authorization)
      ctx.response.body.newToken = newToken
  },
}
