import { legacy_createStore, combineReducers, compose, applyMiddleware } from "redux";
import reduxThunk from 'redux-thunk'
import handleNum from './numState/reducer'
import handleUser from './userState/reducer'
const reducers = combineReducers({
  handleNum,
  handleUser
})
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose
const store = legacy_createStore(reducers, composeEnhancers(applyMiddleware(reduxThunk)))
export default store