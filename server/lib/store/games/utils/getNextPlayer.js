'use strict'

const corePlayerInfo = require('./corePlayerInfo')

const getActivePlayers = (players, teamFilter) => {
  const allActivePlayers = Object.keys(corePlayerInfo.getActivePlayers(players))
  return teamFilter
    ? allActivePlayers.filter(username => players[username].team === teamFilter)
    : allActivePlayers
}

module.exports = (players, pastPlayers, teamFilter) => {
  const activePlayers = getActivePlayers(players, teamFilter)
  const activePlayerCount = activePlayers.length
  const pastPlayerCount = pastPlayers.length
  // If there are fewer active players than past picked players, shrink the list
  // of past players to filter to the same size as the count of active players.
  const baselinePastPlayersToFilterOut =
    activePlayerCount < pastPlayerCount
      ? pastPlayers.slice(pastPlayerCount - activePlayerCount, pastPlayerCount)
      : pastPlayers

  const getNextPlayer = (offset = 0) => {
    // The offset is where we start slicing the list of past players to filter out.
    // Once we are slicing the whole list, we should pick an active player at random.
    // This will also happen immediately when there are no past players.
    // This check will prevent us from hitting a stack overflow.
    if (offset === baselinePastPlayersToFilterOut.length) {
      return activePlayerCount
        ? activePlayers[Math.floor(Math.random() * activePlayers.length)]
        : null // If there are no active users return null
    }
    const pastPlayersToFilterOut = baselinePastPlayersToFilterOut.slice(
      offset,
      baselinePastPlayersToFilterOut.length,
    )
    // Get all active players that are not in the past player list
    const options = activePlayers.filter(username => !pastPlayersToFilterOut.includes(username))
    // If the list of players than can be picked has any players, randomly select one
    // Otherwise, recursively shrink list of past players to filter out by 1 until
    // we find an active player that is an option.
    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : getNextPlayer(offset + 1)
  }

  return getNextPlayer()
}
