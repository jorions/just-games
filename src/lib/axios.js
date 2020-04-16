import axios from 'axios'

import { getUser, setUser, removeUser } from 'lib/storage'
import history from 'lib/history'

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const instance = axios.create(defaultOptions)

// On each request, run this function to add the Authorization token when present in the store
instance.interceptors.request.use(config => {
  const { token = '' } = getUser()
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = token
  return config
})

// On each request, run this function to store the Authorization token when present in the response
instance.interceptors.response.use(
  res => {
    if (res.data && res.data.newToken) setUser(res.data.newToken)
    return res
  },
  err => {
    // TODO: Move to reach router to avoid using 'history' package, then confirm this works
    if (err.response && err.response.status === 403) {
      removeUser()
      history.push('/')
    }
    throw err
  },
)

export default instance
