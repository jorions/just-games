import { logOut } from 'models/globalActions'

export default (err, handlers) => dispatch => {
  const { response = {} } = err
  const { data = {}, status } = response

  if (status === 403) {
    dispatch(logOut())
    return
  }

  if (typeof handlers === 'function') {
    const toDispatch = handlers(data)
    if (toDispatch) dispatch(toDispatch)
    return
  }

  const { defaultHandler, ...statusMap } = handlers

  const handler = statusMap[status]
  if (handler) {
    const toDispatch = handler(data)
    if (toDispatch) dispatch(toDispatch)
    return
  }

  dispatch(defaultHandler(data))
}
