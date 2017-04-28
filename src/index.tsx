
//ie support for promises
//import { Promise } from 'es6-pro
import "es6-promise/auto";

import * as ReactDOM from 'react-dom'
import * as React from 'react'

import * as Redux from 'redux'
import * as Actions from './actions'

import {persistStore, autoRehydrate} from 'redux-persist'
import {Counter} from './components/counter'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'

import {
    reducers,
    Store
} from './reducers'

console.log("test1");

const logger = createLogger({});

let store: Redux.Store<any> = Redux.createStore (
  reducers,
  undefined,
  Redux.compose(
    Redux.applyMiddleware(logger),
    autoRehydrate()
  )
  );

const KEY_PREFIX = 'reduxPersist:';
const REHYDRATE = 'persist/REHYDRATE';

function crosstabSync(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || false
  var whitelist = config.whitelist || false
  console.log("crosstabSync binding")
  window.addEventListener('storage', handleStorageEvent, false)

  console.log("crosstabSync binding done")
  
  function handleStorageEvent(e){
    console.log("bound to event")
    if(e.key.indexOf(KEY_PREFIX) === 0){
      var keyspace = e.key.substr(KEY_PREFIX.length)
      if(whitelist && whitelist.indexOf(keyspace) === -1){ return }
      if(blacklist && blacklist.indexOf(keyspace) !== -1){ return }

      var statePartial = {}
      statePartial[keyspace] = e.newValue
      persistor.rehydrate(statePartial, {serial: true})
    }
  }
}

const persistor = persistStore(store, {})
crosstabSync(persistor, null)

window.localStorage.setItem("foo","bar")

store.subscribe(() => {
  console.log(store.getState())
})

console.log("test");
// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  if (rootEl) ReactDOM.render(
    <div>
      <Provider store={store}>
        <Counter label='count:' />
      </Provider>
      <Provider store={store}>
        <Counter label='count:' />
      </Provider>
    </div>
  , rootEl)
})
