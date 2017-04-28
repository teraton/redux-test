// A dummy react-redux project to test architectural concepts and different libraries


//ie support for promises
//import { Promise } from 'es6-pro
import "es6-promise/auto";

//react ui libs
import * as ReactDOM from 'react-dom'
import * as React from 'react'

//redux modules for data storage. Also includes state persistence and logging
import * as Redux from 'redux'
import * as Actions from './actions'
import {persistStore, autoRehydrate} from 'redux-persist'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'

//project components
import {Counter} from './components/counter'
import {
    reducers,
    Store
} from './reducers'

//create a logger for the redux store and create the store. Inject middleware and autorehydration
const logger = createLogger({});
let store: Redux.Store<any> = Redux.createStore (
  reducers,
  undefined,
  Redux.compose(
    Redux.applyMiddleware(logger),
    autoRehydrate()
  )
  );


//Crosstab sync code, this is acually redux-persist-crosstab code extracted to here
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
    console.log("localStorage change event fired")
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


//tie the local storage persist store to the state of the actual store object and enable crosstab sync
const persistor = persistStore(store, {})
crosstabSync(persistor, null)

//enable console logging
store.subscribe(() => {
  console.log(store.getState())
})

//Replace the dummy content in index.html with react content
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
