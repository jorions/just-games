import { combineReducers } from 'redux'

import message from './message'
import user from './user'
import ui from './ui'

export default combineReducers({ message, user, ui })
