import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from './middleware/api'
import {rootReducer} from './reducers'

const middlewares = [thunk, api]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => composeEnhancers(applyMiddleware(...middlewares))(createStore)(rootReducer)
