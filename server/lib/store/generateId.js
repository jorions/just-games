'use strict'

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
  const newId = `${random(adjectives)}-${random(animals)}`
  return games[newId] ? generateId(games) : newId
}

module.exports = generateId
