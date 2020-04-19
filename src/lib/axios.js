import axios from 'axios'

import { getUser, setUser } from 'lib/storage'

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
instance.interceptors.response.use(res => {
  if (res.headers['new-token']) setUser(res.headers['new-token'])
  return res
})

export default instance
