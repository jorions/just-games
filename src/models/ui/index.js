import { combineReducers } from 'redux'

import game from './game'
import list from './list'
import logIn from './logIn'

export default combineReducers({ game, list, logIn })
