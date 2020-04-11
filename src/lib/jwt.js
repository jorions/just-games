import jwt from 'jsonwebtoken'

// eslint-disable-next-line import/prefer-default-export
export const parseToken = token => {
  const { username } = jwt.decode(token)

  return { username }
}
