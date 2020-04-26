import { gameNames } from 'shared/games'

export default {
  [gameNames.CAH]: (game, username) => ({
    ...game,
    players: Object.entries(game.players).map(([u, info]) => ({ username: u, ...info })),
    yourCards: game.players[username].cards,
    remainingSwaps: game.players[username].remainingSwaps,
  }),
}
