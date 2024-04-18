import {combineReducers} from 'redux'
import appData from '../reducers/appData'

const appReducer = combineReducers({
	appData,
})

export const rootReducer = (state, action) => appReducer(state, action)