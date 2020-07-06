'use strict'

const { gameNames, games } = require('../../../../../shared/games')
const shuffleIdxs = require('../utils/shuffleIdxs')
const shuffle = require('../utils/shuffle')
const getNextPlayer = require('../utils/getNextPlayer')
const getNewDeckIdxs = require('../utils/getNewDeckIdxs')
const corePlayerInfo = require('../utils/corePlayerInfo')
const startingCards = require('./cards')
const structs = require('./structs')

const { PICKING_WINNER, WINNER, PLAYERS_SUBMITTING } = games[gameNames.CAH].statuses

const getNewBlackDeckIdxs = () => shuffleIdxs(startingCards.blackCards)
const getNewWhiteDeckIdxs = () => shuffleIdxs(startingCards.whiteCards)

const ROUND_COOLDOWN_IN_MS = 5000

class CAH {
  #pastCzars = []

  #whiteCardIdxs = getNewWhiteDeckIdxs()

  #blackCardIdxs = getNewBlackDeckIdxs()

  constructor(name, creator, updateGame) {
    // Generic info
    this.name = name
    this.owner = creator
    this.updateGame = updateGame
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
    const cardsInPlayersHands = []
    Object.values(this.players).forEach(({ cards }) => {
      cardsInPlayersHands.push(...cards)
    })
    this.#whiteCardIdxs = getNewDeckIdxs(startingCards.whiteCards, cardsInPlayersHands)
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
    this.czar = getNextPlayer(this.players, this.#pastCzars)
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

  handlePlayerDrop(username, changeOwnerInStore) {
    if (username === this.owner) {
      this.owner = getNextPlayer(this.players)
      changeOwnerInStore(this.owner)
    }

    // If the player is the czar skip the round and move on
    if (username === this.czar) {
      // If the status is WINNER, then the round will move on after setTimeout automatically
      if (this.status.key !== WINNER) this.moveToNextRound()
    } else if (this.status.key === PLAYERS_SUBMITTING) {
      this.moveToPickingWinnerIfAllHavePlayed()
    }
  }

  /* ---------------------------- Player actions ---------------------------- */

  pickWinner(username, pickedWinnerIdx) {
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

    // Move to next round after 5 seconds
    setTimeout(() => {
      // Give winner the black card
      winningPlayer.winningCards.push(this.prompt)
      this.moveToNextRound()
      this.updateGame()
    }, ROUND_COOLDOWN_IN_MS)
  }

  submitCards(username, playedCards) {
    const player = this.players[username]
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

  swapCards(username, swappedCards) {
    const player = this.players[username]
    // Confirm player can swap cards
    if (player.remainingSwaps < swappedCards.length) throw new Error('tooManySwaps')
    // Confirm player owns cards and remove from hand
    const playerCards = player.cards
    swappedCards.forEach(playedCard => {
      const playedCardIdx = playerCards.findIndex(c => c === playedCard)
      if (playedCardIdx === -1) throw new Error('wrongCards')
      playerCards.splice(playedCardIdx, 1)
    })
    // Add new cards to player hand
    for (let i = 0; i < swappedCards.length; i += 1) {
      playerCards.push(this.getNextWhiteCard())
    }
    player.remainingSwaps -= swappedCards.length
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
      for (let i = 0; i < 7; i += 1) {
        cards.push(this.getNextWhiteCard())
      }
      this.players[username] = {
        cards,
        winningCards: [],
        submitted: false,
        remainingSwaps: 7,
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
    const { actions } = games[gameNames.CAH]
    const actionMap = {
      [actions.SUBMIT_CARDS]: (u, d) => this.submitCards(u, d),
      [actions.PICK_WINNER]: (u, d) => this.pickWinner(u, d),
      [actions.SWAP_CARDS]: (u, d) => this.swapCards(u, d),
    }
    actionMap[action](username, data)
  }

  getGame = username => {
    const { name, owner, status, czar, prompt, playedCardsThisRound, players } = this
    let formattedCardsThisRound = playedCardsThisRound
    if (status.key === PLAYERS_SUBMITTING)
      formattedCardsThisRound = playedCardsThisRound.map(({ player }) => player)
    else if (status.key === PICKING_WINNER)
      formattedCardsThisRound = playedCardsThisRound.map(({ playedCards }) => playedCards)
    return {
      name,
      owner,
      status,
      czar,
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

module.exports = { Game: CAH, structs }
