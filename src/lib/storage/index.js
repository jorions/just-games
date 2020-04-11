import { parseToken } from '../jwt'

import { set, get, remove, clear } from './storageWrapper'

const USER_KEY = 'GameUser'

export const setUser = token => {
  set(USER_KEY, token)
}

export const removeUser = () => {
  remove(USER_KEY)
}

export const getUser = () => {
  const token = get(USER_KEY)

  if (!token) return {}

  try {
    const { username } = parseToken(token)
    return { username, token }
  } catch (err) {
    removeUser()
    return {}
  }
}

export const logOut = () => {
  clear()
}
