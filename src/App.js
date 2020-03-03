import React, { Component } from 'react';
import {
  Platform,
  YellowBox,
} from 'react-native';
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import Route from './routes/route'
import reducer from './reducers'
import storage from './store/store'

console.disableYellowBox = true
const persistConfig ={
  
    key: 'root',
    storage,
    blacklist: ['messages', 'voiceMails']
  }

const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer, applyMiddleware(thunk, logger))
export {store}
const persistor = persistStore(store)
class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} >
          <Route />
        </PersistGate>
      </Provider>
    )
  }
}

let hotWrapper = () => () => App
if (Platform.OS === 'web') {
  const { hot } = require('react-hot-loader')
  hotWrapper = hot
}
export default hotWrapper(module)(App)


