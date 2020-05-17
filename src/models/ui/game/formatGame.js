import { gameNames, games } from 'shared/games'

const codenames = games[gameNames.CODENAMES]

export default {
  [gameNames.CAH]: (game, username) => ({
    ...game,
    players: Object.entries(game.players).map(([u, info]) => ({ username: u, ...info })),
    yourCards: game.players[username].cards,
    remainingSwaps: game.players[username].remainingSwaps,
  }),
  [gameNames.CODENAMES]: (game, username) => {
    const { values, statuses } = codenames
    const playersList = Object.entries(game.players)
    const playerTeam = game.players[username].team
    const red = {
      ...game.red,
      players: playersList.filter(([, { team }]) => team === values.RED).map(([u]) => u),
    }
    const blue = {
      ...game.blue,
      players: playersList.filter(([, { team }]) => team === values.BLUE).map(([u]) => u),
    }
    let teamData
    if (playerTeam === values.RED) teamData = red
    else if (playerTeam === values.BLUE) teamData = blue

    const playerTeamIsPlaying = !!(teamData && teamData.playing)

    return {
      ...game,
      players: playersList.map(([u, info]) => ({ username: u, ...info })),
      playerTeam,
      playerTeamIsPlaying,
      playerTeamData: teamData,
      red,
      blue,
      teamIsVoting: playerTeamIsPlaying && game.status.key === statuses.VOTING,
      playerVote: game.players[username].vote,
    }
  },
}
