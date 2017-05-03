import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import {
  incrementCounter,
  resetCounter,
  saveCount,
  loadCount
} from '../actions'

import { Store } from '../reducers'

interface OwnProps {
    label: string;
}

interface ConnectedState  {
  counter: { value: number }
  isSaving: boolean,
  isLoading: boolean,
  error: string,
}

type ConnectedDispatch = {
  increment: (n: number) => void
  save: (n: number) => void
  load: () => void
  reset: () => void
}

const mapStateToProps = (state: Store.All, ownProps: OwnProps): ConnectedState => ({
  counter: state.counter,
  isSaving: state.isSaving,
  isLoading: state.isLoading,
  error: state.error,
})

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
  increment: (n: number) =>
    dispatch(incrementCounter(n)),
  load: () =>
    dispatch(loadCount.request()),
  save: (value: number) =>
    dispatch(saveCount.request({ value })),
  reset: () =>
    dispatch(resetCounter()),
})



interface OwnState {};

//-------------------------------------------

//counter component definition
class CounterComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch,OwnState>{
     _onClickIncrement = (delta) => {
        this.props.increment(delta);
    }
    _onClickReset = () => {
        this.props.reset();
    }
    _onClickSave = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!this.props.isSaving) {
        this.props.save(this.props.counter.value)
        }
    }

    _onClickLoad = (e: React.SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!this.props.isLoading) {
        this.props.load()
        }
    }

    render () {
    const { counter, label, isSaving, isLoading, error } = this.props
    return <div>
      <label>{label}</label>
      <pre>counter = {counter.value}</pre>
      <button ref='increment' onClick={() => this._onClickIncrement(5)}>increment</button>
      <button ref='reset' onClick={this._onClickReset}>reset</button>
      <button ref='save' disabled={isSaving} onClick={this._onClickSave}>{isSaving ? 'saving...' : 'save'}</button>
      <button ref='load' disabled={isLoading} onClick={this._onClickLoad}>{ isLoading ? 'loading...' : 'load'}</button>
      { error ? <div className='error'>{error}</div> : null }
    </div>
  }
}


export const Counter: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(CounterComponent)