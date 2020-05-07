'use strict'

const shuffle = require('./shuffle')

module.exports = (fullDeck, cardsInUse) => {
  const cardsInUseMap = {}
  cardsInUse.forEach(card => {
    cardsInUseMap[card] = true
  })
  return shuffle(
    fullDeck
      .map((card, idx) => ({ card, idx }))
      .filter(({ card }) => !cardsInUseMap[card])
      .map(({ idx }) => idx),
  )
}
