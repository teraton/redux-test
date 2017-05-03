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


//"immutable props that relate to how the component is rendered. For example, label here is not meant to be mutated, it is assigned at render time"
interface OwnProps {
    label: string;
}

//the next four segments are explained pretyt well by http://redux.js.org/docs/basics/UsageWithReact.html

//state that is modified from "outside"
interface ConnectedState  {
  counter: { value: number }
  isSaving: boolean,
  isLoading: boolean,
  error: string,
}
const mapStateToProps = (state: Store.All, ownProps: OwnProps): ConnectedState => ({
  counter: state.counter,
  isSaving: state.isSaving,
  isLoading: state.isLoading,
  error: state.error,
})

//these are the props that trigger events. This maps all the changes to action creators?

type ConnectedDispatch = {
  increment: (n: number) => void
  save: (n: number) => void
  load: () => void
  reset: () => void
}
const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
  increment: (n: number) =>
    dispatch(incrementCounter(n)),
  load: () =>
    dispatch(loadCount()),
  save: (value: number) =>
    dispatch(saveCount({ value })),
  reset: () =>
    dispatch(resetCounter()),
})


//the own state of the react component. when using redux properly, this should stay empty. All state is stored centrally.
interface OwnState {};

//-------------------------------------------

//counter component definition & event handlers that pass the change events to props, which pass it to action creators through dispatch
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

//the component is connected to the store here , this is in the bottom because of a bug: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/8787
export const Counter: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(CounterComponent)