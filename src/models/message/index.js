import * as actions from './actions'

export { default } from './reducer'

const { confirmMessage } = actions

export { confirmMessage }

export const setMessage = message => (dispatch, getState) => {
  const {
    message: { message: currentMessage },
  } = getState()
  if (currentMessage !== message) dispatch(actions.setMessage(message))
}
