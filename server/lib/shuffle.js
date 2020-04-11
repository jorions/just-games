'use strict'

module.exports = arr => {
  const newArr = [...arr]
  let currentIndex = newArr.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = newArr[currentIndex]
    newArr[currentIndex] = newArr[randomIndex]
    newArr[randomIndex] = temporaryValue
  }

  return newArr
}
