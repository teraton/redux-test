import * as ReactDOM from 'react-dom'
import * as React from 'react'

import * as Redux from 'redux'
import * as Actions from './actions'

import {persistStore, autoRehydrate} from 'redux-persist'
import {Counter} from './components/counter'
import { Provider } from 'react-redux'

import {
    reducers,
    Store
} from './reducers'
console.log("test1");
let store: Redux.Store<any> = Redux.createStore (
  reducers,
  undefined,
  Redux.compose(
    Redux.applyMiddleware(),
    autoRehydrate()
  )
  );

//crosstab persistence support
const persistor = persistStore(store, {})

var KEY_PREFIX = 'reduxPersist:';

function crosstabSync(persistor, config){
  var config = config || {}
  var blacklist = config.blacklist || false
  var whitelist = config.whitelist || false

  window.addEventListener('storage', handleStorageEvent, false)

  function handleStorageEvent(e){
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

crosstabSync(persistor, {});

store.subscribe(() => {
  console.log(store.getState())
})
console.log("test");
// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  if (rootEl) ReactDOM.render(
    <Provider store={store}>
      <Counter label='count:' />
    </Provider>
  , rootEl)
})
