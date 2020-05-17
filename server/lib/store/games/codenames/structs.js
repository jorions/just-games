'use strict'

const struct = require('../../../structs')
const { gameNames, games } = require('../../../../../shared/games')

const { actions, values } = games[gameNames.CODENAMES]

module.exports = {
  [actions.CHOOSE_TEAM]: struct({ data: struct.enum([values.RED, values.BLUE]) }),
  [actions.START_GAME]: struct({}),
  [actions.GIVE_HINT]: struct({ data: { hint: 'stringNoSpaces?', cap: 'number' } }),
  [actions.VOTE]: struct({
    data: { x: struct.enum([0, 1, 2, 3, 4]), y: struct.enum([0, 1, 2, 3, 4]) },
  }),
  [actions.END_ROUND]: struct({}),
}
