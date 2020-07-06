'use strict'

const { gameNames, games } = require('../../../../../shared/games')
const shuffleIdxs = require('../utils/shuffleIdxs')
const shuffle = require('../utils/shuffle')
const getNextPlayer = require('../utils/getNextPlayer')
const getNewDeckIdxs = require('../utils/getNextPlayer')
const corePlayerInfo = require('../utils/corePlayerInfo')
const startingCards = require('./cards')
const structs = require('./structs')

const {
  statuses: { STARTING, GIVING_HINT, VOTING, VOTED, WINNER },
  values: { RED, BLUE, BLACK, TAN },
} = games[gameNames.CODENAMES]

const VOTE_COOLDOWN_IN_MS = 5000
const ROUND_COOLDOWN_IN_MS = 5000

const emptyGrid = () => {
  const row = () => Array(5)
  return [row(), row(), row(), row(), row()]
}

const buildSpyLayout = () => {
  let coordinates = []
  for (let x = 0; x < 5; x += 1) {
    for (let y = 0; y < 5; y += 1) {
      coordinates.push([x, y])
    }
  }
  coordinates = shuffle(coordinates)

  const layout = emptyGrid()
  const assign = (cap, type) => {
    for (let i = 0; i < cap; i += 1) {
      const [x, y] = coordinates.shift()
      layout[y][x] = type
    }
  }

  const { redCap, blueCap } =
    Math.random() < 0.5 ? { redCap: 8, blueCap: 9 } : { redCap: 9, blueCap: 8 }

  assign(redCap, RED)
  assign(blueCap, BLUE)
  assign(1, BLACK)
  assign(coordinates.length, TAN)

  return { redCap, blueCap, layout }
}

class CODENAMES {
  #pastBlueSpymasters = []

  #pastRedSpymasters = []

  #cardIdxs = shuffleIdxs(startingCards)

  constructor(name, creator, updateGame) {
    const { redCap, blueCap, layout } = buildSpyLayout()

    // Generic info
    this.name = name
    this.owner = creator
    this.updateGame = updateGame
    /*
    {
      team: null | RED | BLUE
      vote: null | { x, y }
    }
    */
    this.players = {}
    // Game-specific
    this.status = {
      key: STARTING,
      data: null,
    }
    this.red = {
      score: 0,
      spymaster: null,
      playing: redCap > blueCap,
      cardCount: redCap,
    }
    this.blue = {
      score: 0,
      spymaster: null,
      playing: blueCap > redCap,
      cardCount: blueCap,
    }
    this.board = this.getNextBoard()
    this.spyLayout = layout
    // Timeout to move to GIVING_HINT. Saved so we can clearTimeout when needed.
    this.moveToNextHintTimeout = null

    // Setup
    this.addOrRefreshPlayer(creator)
  }

  /*
  ==============================================================================
  ============================== PRIVATE METHODS ===============================
  ==============================================================================
  */

  getNextBoard() {
    const board = emptyGrid()
    const usedCards = []
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        const text = startingCards[this.#cardIdxs.shift()]
        board[y][x] = { text, hidden: true }
        usedCards.push(text)
        if (!this.#cardIdxs.length) this.#cardIdxs = getNewDeckIdxs(startingCards, usedCards)
      }
    }
    return board
  }

  pickNextSpymasters() {
    if (this.status.key !== STARTING) {
      this.#pastRedSpymasters.push(this.red.spymaster)
      this.#pastBlueSpymasters.push(this.blue.spymaster)
    }
    this.red.spymaster = getNextPlayer(this.players, this.#pastRedSpymasters, RED)
    this.blue.spymaster = getNextPlayer(this.players, this.#pastBlueSpymasters, BLUE)
    this.status = {
      key: GIVING_HINT,
      data: null,
    }
  }

  getTeamVisibleCount(team) {
    let visible = 0
    for (let y = 0; y < 5; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        if (this.spyLayout[y][x] === team && !this.board[y][x].hidden) {
          visible += 1
        }
      }
    }
    return visible
  }

  moveToWinner(winner) {
    this.status = { key: WINNER, data: winner }
    this[winner === RED ? 'red' : 'blue'].score += 1
    setTimeout(() => {
      this.moveToNextBoard()
      this.updateGame()
    }, ROUND_COOLDOWN_IN_MS)
  }

  resetPlayerVotes() {
    Object.keys(this.players).forEach(u => {
      this.players[u].vote = null
    })
  }

  processVotes(vote, team) {
    const { x, y } = vote
    const {
      data: { hint, cap, count: oldCount },
    } = this.status
    this.board[y][x].hidden = false
    const count = oldCount + 1
    const cardColor = this.spyLayout[y][x]
    const oppositeTeam = team === RED ? BLUE : RED
    const pickedRightTeam = cardColor === team
    const pickedWrongTeam = cardColor === oppositeTeam

    this.status = {
      key: VOTED,
      data: { hint, cap, count, vote, pickedRightTeam, pickedWrongTeam },
    }

    // Move to next status after 5 seconds
    this.moveToNextHintTimeout = setTimeout(() => {
      if (cardColor === BLACK) this.moveToWinner(oppositeTeam)
      else if (pickedRightTeam) {
        const visible = this.getTeamVisibleCount(team)
        const total = team === RED ? this.red.cardCount : this.blue.cardCount
        // If all cards have been selected, team wins
        if (visible === total) this.moveToWinner(team)
        // If moves are still available, kick back to VOTING
        else if (this.status.data.count <= cap) {
          this.status = { key: VOTING, data: { hint, cap, count, votes: [] } }
          this.resetPlayerVotes()
          clearTimeout(this.moveToNextHintTimeout)
        }
        // Else switch to other team
        else this.moveToNextHint()
      } else if (pickedWrongTeam) {
        const visible = this.getTeamVisibleCount(oppositeTeam)
        const total = oppositeTeam === RED ? this.red.cardCount : this.blue.cardCount
        // If all of the cards have been selected, opposite team wins
        if (visible === total) this.moveToWinner(oppositeTeam)
        // Else move to next hint
        else this.moveToNextHint()
      } else {
        this.moveToNextHint()
      }
      this.updateGame()
    }, VOTE_COOLDOWN_IN_MS)
  }

  moveToNextStatusBasedOnVotes() {
    const team = this.red.playing ? RED : BLUE
    const teamVotes = Object.entries(corePlayerInfo.getActivePlayers(this.players))
      .filter(
        ([u, player]) =>
          player.team === team && u !== this.red.spymaster && u !== this.blue.spymaster,
      )
      .map(([, { vote }]) => vote)

    const dedupedVotes = []
    teamVotes
      .filter(vote => vote) // Filter null votes
      .forEach(({ x, y }) => {
        if (!dedupedVotes.find(vote => vote.x === x && vote.y === y)) dedupedVotes.push({ x, y })
      })

    if (teamVotes.every(vote => !!vote)) {
      // If there are no active players to vote, move to the next round
      if (dedupedVotes.length === 0) this.moveToNextHint()
      // If all votes match up, move to VOTED
      else if (dedupedVotes.length === 1) this.processVotes(dedupedVotes[0], team)
      // Otherwise there is a conflict
      else this.status = { ...this.status, data: { ...this.status.data, votes: dedupedVotes } }
    } else {
      this.status = { ...this.status, data: { ...this.status.data, votes: dedupedVotes } }
    }
  }

  moveToNextBoard() {
    const { redCap, blueCap, layout } = buildSpyLayout()

    this.status = {
      key: GIVING_HINT,
      data: null,
    }
    // Pick which team starts first
    this.red.playing = redCap > blueCap
    this.red.cardCount = redCap
    this.blue.playing = blueCap > redCap
    this.blue.cardCount = blueCap
    // Reset the board and spy layout
    this.board = this.getNextBoard()
    this.spyLayout = layout
    // Reset every player vote
    this.resetPlayerVotes()
    this.pickNextSpymasters()
  }

  moveToNextHint() {
    this.status = {
      key: GIVING_HINT,
      data: null,
    }
    // Swap who is playing
    this.red.playing = !this.red.playing
    this.blue.playing = !this.blue.playing
    // Reset every player vote
    Object.keys(this.players).forEach(u => {
      this.players[u].vote = null
    })
    // Remove setTimeout reference
    this.moveToNextHintTimeout = null
  }

  handlePlayerDrop(username, changeOwnerInStore) {
    // Transfer ownership
    if (username === this.owner) {
      this.owner = getNextPlayer(this.players)
      changeOwnerInStore(this.owner)
    }

    // If the player is the spymaster skip the round and move on
    if (username === this.red.spymaster || username === this.blue.spymaster) {
      // If the status is WINNER, then the round will move on after setTimeout automatically
      if (this.status.key !== WINNER) {
        // If the status is VOTED there is a setTimeout for moving to GIVING_HINT
        if (this.status.key === VOTED) clearTimeout(this.moveToNextHintTimeout)
        this.moveToNextBoard()
      }
    } else if (this.status.key === VOTING) {
      this.players[username].vote = null
      this.moveToNextStatusBasedOnVotes()
    }
  }

  verifyPlayer(username, mustBeSpymaster = false) {
    const { team } = this.players[username]
    if (!team) throw new Error('notOnATeam')
    const { playing, spymaster } = this[team === RED ? 'red' : 'blue']
    if (!playing) throw new Error('notYourTurn')
    if (mustBeSpymaster && spymaster !== username) throw new Error('notSpymaster')
  }

  // When the player just became the only active member on their team, and their
  // team was supposed to be playing, the game had been in a logic hole waiting for
  // someone on the empty team to give a hint. So move to the next board.
  moveRoundIfGameFellInHole(pickedTeamOrWasInactive, username) {
    // If the status is WINNER, then the round will move on after setTimeout automatically
    if (!pickedTeamOrWasInactive || this.status.key === STARTING || this.status.key === WINNER)
      return

    const playerTeam = this.players[username].team
    let teamIsPlaying = false
    if (playerTeam === RED && this.red.playing) teamIsPlaying = true
    else if (playerTeam === BLUE && this.blue.playing) teamIsPlaying = true

    const isOnlyActivePlayerOnPlayingTeam =
      teamIsPlaying &&
      Object.values(corePlayerInfo.getActivePlayers(this.players)).filter(
        ({ team }) => team === playerTeam,
      ).length === 1

    if (isOnlyActivePlayerOnPlayingTeam) {
      // If the status is VOTED there is a setTimeout for moving to GIVING_HINT
      if (this.status.key === VOTED) clearTimeout(this.moveToNextHintTimeout)
      this.moveToNextBoard()
    }
  }

  /* ---------------------------- Player actions ---------------------------- */

  chooseTeam(username, team) {
    if (this.players[username].team) throw new Error('alreadyOnTeam')
    this.players[username].team = team
    this.moveRoundIfGameFellInHole(true, username)
  }

  startGame(username) {
    if (this.owner !== username) throw new Error('mustBeOwner')
    if (this.status.key !== STARTING) throw new Error('mustBeStarting')
    let redCount = 0
    let blueCount = 0
    Object.values(this.players).forEach(({ team }) => {
      if (team === RED) redCount += 1
      else if (team === BLUE) blueCount += 1
    })
    if (redCount < 2 || blueCount < 2) throw new Error('notEnoughPlayers')
    this.pickNextSpymasters()
  }

  giveHint(username, { hint, cap }) {
    this.verifyPlayer(username, true)
    if (this.status.key !== GIVING_HINT) throw new Error('mustBeGivingHint')
    this.status = { key: VOTING, data: { hint, cap, count: 0, votes: [] } }
  }

  vote(username, { x, y }) {
    this.verifyPlayer(username)
    if (this.status.key !== VOTING) throw new Error('mustBeVoting')
    if (!this.board[y][x].hidden) throw new Error('mustBeHidden')
    this.players[username].vote = { x, y }
    this.moveToNextStatusBasedOnVotes()
  }

  endRound(username) {
    this.verifyPlayer(username, true)
    if (this.status.key !== VOTING) throw new Error('mustBeVoting')
    this.moveToNextHint()
  }

  // /*
  // ==============================================================================
  // ============================== PUBLIC METHODS ================================
  // ==============================================================================
  // */

  addOrRefreshPlayer = username => {
    const currentPlayer = this.players[username]
    if (currentPlayer) {
      const wasInactive = !currentPlayer.isActive
      this.players[username] = {
        ...currentPlayer,
        ...corePlayerInfo.refresh(),
      }
      this.moveRoundIfGameFellInHole(wasInactive, username)
    } else {
      this.players[username] = {
        team: null,
        vote: null,
        ...corePlayerInfo.add(),
      }
    }
  }

  refreshPlayer = username => {
    this.players[username] = {
      ...this.players[username],
      ...corePlayerInfo.refresh(),
    }
  }

  markPlayerInactive = (username, changeOwnerInStore) => {
    this.players[username] = {
      ...this.players[username],
      ...corePlayerInfo.inactive(),
    }
    this.handlePlayerDrop(username, changeOwnerInStore)
  }

  removePlayer = (username, changeOwnerInStore) => {
    delete this.players[username]
    this.handlePlayerDrop(username, changeOwnerInStore)
  }

  submitAction = ({ username, action, data }) => {
    const { actions } = games[gameNames.CODENAMES]
    const actionMap = {
      [actions.CHOOSE_TEAM]: (u, d) => this.chooseTeam(u, d),
      [actions.START_GAME]: u => this.startGame(u),
      [actions.GIVE_HINT]: (u, d) => this.giveHint(u, d),
      [actions.VOTE]: (u, d) => this.vote(u, d),
      [actions.END_ROUND]: u => this.endRound(u),
    }
    actionMap[action](username, data)
  }

  getGame = username => {
    const { name, owner, status, players, red, blue, board, spyLayout } = this
    const { team } = players[username]
    const isSpymaster = team && this[team === RED ? 'red' : 'blue'].spymaster === username
    return {
      name,
      owner,
      status,
      red,
      blue,
      board: board.map((row, y) =>
        row.map((card, x) => ({ ...card, color: card.hidden ? null : spyLayout[y][x] })),
      ),
      spyLayout: isSpymaster || status.key === WINNER ? spyLayout : null,
      players,
    }
  }
}

module.exports = { Game: CODENAMES, structs }
