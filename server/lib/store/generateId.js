'use strict'

const randomString = require('../randomString')

const adjectives = [
  'amorphous',
  'amiable',
  'aloof',
  'backtracking',
  'bellicose',
  'bored',
  'crafty',
  'cute',
  'cowardly',
  'ditsy',
  'diligent',
  'delirious',
  'exemplary',
  'energetic',
  'easygoing',
  'faltering',
  'freakish',
  'fanstastical',
  'grouchy',
  'grateful',
  'gregarious',
  'hilarious',
  'hopeful',
  'hammered',
  'illicit',
  'imploding',
  'insidious',
  'jolly',
  'jesting',
  'jarring',
  'kindly',
  'kooky',
  'kaleidoscopic',
  'lame',
  'lazy',
  'lanky',
  'majestic',
  'modest',
  'meek',
  'naughty',
  'nihilistic',
  'nonsensical',
  'opulent',
  'oppressive',
  'outlandish',
  'porous',
  'palatable',
  'prudish',
  'questionable',
  'quick',
  'quarrelsome',
  'rambunctious',
  'rough',
  'ranting',
  'sweet',
  'snarling',
  'saucy',
  'twisted',
  'tardy',
  'telepathic',
  'unctious',
  'unbelievable',
  'unyielding',
  'vexing',
  'vast',
  'voluminous',
  'weary',
  'wandering',
  'wistful',
  'xenodochial',
  'yammering',
  'yodeling',
  'zany',
  'zealous',
  'zippy',
]
const animals = [
  'aardvark',
  'badger',
  'crocodile',
  'elephant',
  'falcon',
  'goose',
  'hammerhead',
  'iguana',
  'jaguar',
  'kangaroo',
  'lemur',
  'macaw',
  'newt',
  'octopus',
  'peacock',
  'quail',
  'rabbit',
  'slot',
  'tiger',
  'walrus',
  'yak',
  'zebra',
]

const random = arr => arr[Math.floor(Math.random() * arr.length)]

const generateId = games => {
  // Fall back to random string ID if there are already more games than possible combos
  const idCount = Object.keys(games).length
  if (idCount >= adjectives.length * animals.length) return randomString(12)

  let newId = `${random(adjectives)}-${random(animals)}`
  while (games[newId]) {
    newId = generateId(games)
  }
  return newId
}

module.exports = generateId
