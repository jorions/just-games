'use strict'

module.exports = {
  add: () => {
    const time = new Date()
    return {
      isActive: true,
      timeJoined: time,
      lastPolled: time,
    }
  },
  refresh: () => ({
    isActive: true,
    lastPolled: new Date(),
  }),
  inactive: () => ({ isActive: false }),
  getActivePlayers: players =>
    Object.entries(players).reduce((acc, [username, player]) => {
      if (!player.isActive) return acc
      acc[username] = player
      return acc
    }, {}),
  getCoreInfo: ({ isActive, lastPolled, timeJoined }) => ({
    isActive,
    lastPolled,
    timeJoined,
  }),
}
