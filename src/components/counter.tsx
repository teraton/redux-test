import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import {
  incrementCounter,
  resetCounter
} from '../actions'

import { Store } from '../reducers'

const mapStateToProps = (state: Store.All, OwnProps: OwnProps): ConnectedState => ({
    counter: state.counter
})

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    increment: (n: number) => {
        dispatch(incrementCounter(n));
    },
    reset: () => {
        dispatch(resetCounter());
    }
})

interface OwnProps {
    label: string;
}

interface ConnectedState {
    counter: {value: number}
}

interface ConnectedDispatch {
    increment: (n: number) => void;
    reset: () => void;
}

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
    render () {
    const { counter, label } = this.props
    return <div>
      <label>{label}</label>
      <pre>counter = {counter.value}</pre>
      <button ref='increment' onClick={() => this._onClickIncrement(5)}>increment</button>
      <button ref='reset' onClick={this._onClickReset}>reset</button>
    </div>
  }
}


export const Counter: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(CounterComponent)