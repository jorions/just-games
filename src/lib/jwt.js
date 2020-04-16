import jwt from 'jsonwebtoken'

// eslint-disable-next-line import/prefer-default-export
export const parseToken = token => {
  const { username, exp: expInSec } = jwt.decode(token)

  if (expInSec * 1000 < Date.now()) throw new Error('Expired token')

  return { username }
}
