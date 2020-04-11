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

    const {
      token: newToken,
      data: { username },
    } = await parseAndRefreshIfNeeded(log, authorization)

    ctx.state.username = username

    await next()

    // If its a good response and token got refreshed, add to body
    if (ctx.response.status > 300 && newToken !== authorization)
      ctx.response.body.newToken = newToken
  },
}
