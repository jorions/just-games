'use strict'

module.exports = {
  add: () => {
    const time = Date.now()
    return {
      isActive: true,
      timeJoined: time,
      lastPolled: time,
    }
  },
  refresh: () => ({
    isActive: true,
    lastPolled: Date.now(),
  }),
  inactive: () => ({ isActive: false }),
  getActivePlayers: players =>
    Object.entries(players).reduce((acc, [username, player]) => {
      if (!player.isActive) return acc
      acc[username] = player
      return acc
    }, {}),
  getStatusInfo: ({ isActive, timeJoined }) => ({
    isActive,
    timeJoined,
  }),
}
