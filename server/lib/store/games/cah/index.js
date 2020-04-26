'use strict'

const { gameNames, games } = require('../../../../../shared/games')
const shuffle = require('../../../shuffle')
const corePlayerInfo = require('../corePlayerInfo')
const startingCards = require('./cards')

const { PICKING_WINNER, WINNER, PLAYERS_SUBMITTING } = games[gameNames.CAH].statuses

const getNewBlackDeckIdxs = () => shuffle([...Array(startingCards.blackCards.length).keys()])
const getNewWhiteDeckIdxs = () => shuffle([...Array(startingCards.whiteCards.length).keys()])

const ROUND_COOLDOWN_IN_MS = 5000

// Use 'function' to avoid binding 'this' to above scope. This lets us create multiple instances of the game.
class CAH {
  #pastCzars = []

  #whiteCardIdxs = getNewWhiteDeckIdxs()

  #blackCardIdxs = getNewBlackDeckIdxs()

  constructor(name, creator) {
    // Generic info
    this.name = name
    this.owner = creator
    this.players = {}
    // Game-specific
    this.status = {
      key: PLAYERS_SUBMITTING,
      data: null,
    }
    this.czar = creator
    this.prompt = this.getNextBlackCard()
    this.playedCardsThisRound = []

    // Setup
    this.addOrRefreshPlayer(creator)
  }

  /*
  ==============================================================================
  ============================== PRIVATE METHODS ===============================
  ==============================================================================
  */

  refreshWhiteCards() {
    // Reset the white cards by adding all cards back that are not currently in players' hands
    const cardsInPlayersHands = {}
    Object.values(this.players).forEach(({ cards }) => {
      cards.forEach(card => {
        cardsInPlayersHands[card] = true
      })
    })
    this.#whiteCardIdxs = shuffle(
      startingCards.whiteCards
        .map((card, idx) => ({ card, idx }))
        .filter(({ card }) => !cardsInPlayersHands[card])
        .map(({ idx }) => idx),
    )
  }

  getNextBlackCard() {
    if (!this.#blackCardIdxs.length) this.#blackCardIdxs = getNewBlackDeckIdxs()
    return startingCards.blackCards[this.#blackCardIdxs.shift()]
  }

  getNextWhiteCard() {
    if (!this.#whiteCardIdxs.length) this.refreshWhiteCards()
    return startingCards.whiteCards[this.#whiteCardIdxs.shift()]
  }

  pickNextCzar() {
    this.#pastCzars.push(this.czar)
    const activePlayers = corePlayerInfo.getActivePlayers(this.players)
    const activePlayerCount = Object.keys(activePlayers).length
    // If there are fewer active players than the czars being filtered out, shrink
    // the list of czars to start at the same size as the count of active players.
    const baselineCzarsToFilterOut =
      activePlayerCount < this.#pastCzars.length
        ? this.#pastCzars.slice(this.#pastCzars.length - activePlayerCount, this.#pastCzars.length)
        : this.#pastCzars
    const getNextCzar = (offset = 0) => {
      // If we've reached the end of the array just pick an active player at random
      if (offset === baselineCzarsToFilterOut.length) {
        const activeUsernames = Object.keys(activePlayers)
        return activeUsernames.length
          ? activeUsernames[Math.floor(Math.random() * activeUsernames.length)]
          : null // If there are no active users bail out to avoid a stack overflow
      }
      const czarsToFilterOut = baselineCzarsToFilterOut.slice(
        offset,
        baselineCzarsToFilterOut.length,
      )
      // Get all active players that are not in the czar list
      const canUse = Object.keys(activePlayers).filter(
        username => !czarsToFilterOut.includes(username),
      )
      // If the list of players than can become the czar has any players, randomly select one
      // Otherwise, recursively shrink list of potential czars by 1 until we find an active player that is an option
      return canUse.length
        ? canUse[Math.floor(Math.random() * canUse.length)]
        : getNextCzar(offset + 1)
    }
    this.czar = getNextCzar()
    this.status = {
      key: PLAYERS_SUBMITTING,
      data: null,
    }
  }

  moveToPickingWinnerIfAllHavePlayed() {
    // If all players have played, change status and reset cards
    if (
      Object.entries(corePlayerInfo.getActivePlayers(this.players)).every(([u, { submitted }]) =>
        u === this.czar ? true : submitted,
      )
    ) {
      this.status = { key: PICKING_WINNER, data: null }
      this.playedCardsThisRound = shuffle(this.playedCardsThisRound)
    }
  }

  moveToNextRound() {
    // Reset the black card
    this.prompt = this.getNextBlackCard()
    // Clear players' choices
    this.playedCardsThisRound = []
    // Set every player submitting to false
    Object.keys(this.players).forEach(u => {
      this.players[u].submitted = false
    })
    this.pickNextCzar()
  }

  handlePlayerDrop(username) {
    // If the player is the czar skip the round and move on
    if (username === this.czar) {
      // If the status is WINNER, then the round will move on after setTimeout automatically
      if (this.status !== WINNER) this.moveToNextRound()
    } else if (this.status === PLAYERS_SUBMITTING) {
      this.moveToPickingWinnerIfAllHavePlayed()
    }
  }

  /* ---------------------------- Player actions ---------------------------- */

  pickWinner(username, pickedWinnerIdx, updateGame) {
    // Confirm submitter is the czar
    if (this.czar !== username) throw new Error('notCzar')
    // Confirm game is in proper phase
    if (this.status.key !== PICKING_WINNER) throw new Error('invalidGameStatus')
    // Confirm picked winner exists
    const { player: pickedWinner } = this.playedCardsThisRound[pickedWinnerIdx]
    const winningPlayer = this.players[pickedWinner]
    if (!winningPlayer) throw new Error('playerDoesNotExist')

    // Change the status
    this.status = {
      key: WINNER,
      data: pickedWinner,
    }

    // Move to next round after 10 seconds
    setTimeout(() => {
      // Give winner the black card
      winningPlayer.winningCards.push(this.prompt)
      this.moveToNextRound()
      updateGame()
    }, ROUND_COOLDOWN_IN_MS)
  }

  submitCards(username, playedCards) {
    const player = this.players[username]
    // Confirm player exists
    if (!player) throw new Error('playerDoesNotExist')
    // Confirm game is in proper phase
    if (this.status.key !== PLAYERS_SUBMITTING) throw new Error('invalidGameStatus')
    // Confirm submitter is not czar
    if (this.czar === username) throw new Error('userIsCzar')
    // Confirm player has not already submitted cards
    if (this.playedCardsThisRound.some(played => played.player === username))
      throw new Error('userAlreadyPlayed')
    if (playedCards.length !== this.prompt.pick) throw new Error('wrongCards')
    // Confirm player owns cards and remove from hand
    const playerCards = player.cards
    playedCards.forEach(playedCard => {
      const playedCardIdx = playerCards.findIndex(c => c === playedCard)
      if (playedCardIdx === -1) throw new Error('wrongCards')
      playerCards.splice(playedCardIdx, 1)
    })
    // Add played cards to game
    this.playedCardsThisRound.push({ player: username, playedCards })
    // Add new cards to player hand
    for (let i = 0; i < playedCards.length; i += 1) {
      playerCards.push(this.getNextWhiteCard())
    }
    // Update player
    player.submitted = true

    this.moveToPickingWinnerIfAllHavePlayed()
  }

  /*
  ==============================================================================
  ============================== PUBLIC METHODS ================================
  ==============================================================================
  */

  addOrRefreshPlayer = username => {
    const currentPlayer = this.players[username]
    if (currentPlayer) {
      this.players[username] = {
        ...currentPlayer,
        ...corePlayerInfo.refresh(),
      }
    } else {
      const cards = []
      // TODO: Move to 7 cards with swapping
      for (let i = 0; i < 10; i += 1) {
        cards.push(this.getNextWhiteCard())
      }
      this.players[username] = {
        cards,
        winningCards: [],
        submitted: false,
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

  markPlayerInactive = username => {
    this.players[username] = {
      ...this.players[username],
      ...corePlayerInfo.inactive(),
    }
    this.handlePlayerDrop(username)
  }

  removePlayer = username => {
    delete this.players[username]
    this.handlePlayerDrop(username)
  }

  submitAction = ({ username, action, data }, updateGame) => {
    const { actions } = games[gameNames.CAH]
    const actionMap = {
      [actions.SUBMIT_CARDS]: (...args) => this.submitCards(...args),
      [actions.PICK_WINNER]: (...args) => this.pickWinner(...args, updateGame),
    }
    actionMap[action](username, data)
  }

  getGame = username => {
    const { owner, status, czar, prompt, playedCardsThisRound, players } = this
    let formattedCardsThisRound = playedCardsThisRound
    if (status.key === PLAYERS_SUBMITTING)
      formattedCardsThisRound = playedCardsThisRound.map(({ player }) => player)
    else if (status.key === PICKING_WINNER)
      formattedCardsThisRound = playedCardsThisRound.map(({ playedCards }) => playedCards)
    return {
      owner,
      status,
      czar,
      name: this.name,
      prompt,
      playedCardsThisRound: formattedCardsThisRound,
      players: Object.entries(players).reduce((acc, [u, info]) => {
        if (u === username) acc[u] = info
        else
          acc[u] = {
            winningCards: info.winningCards,
            submitted: info.submitted,
            ...corePlayerInfo.getStatusInfo(info),
          }
        return acc
      }, {}),
    }
  }
}

module.exports = CAH
