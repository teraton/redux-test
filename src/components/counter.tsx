import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'

import {
  incrementCounter,
} from '../actions'

import { Store } from '../reducers'

const mapStateToProps = (state: Store.All, OwnProps: OwnProps): ConnectedState => ({
    counter: state.counter
})

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    increment: (n: number) => {
        dispatch(incrementCounter(1));
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
}

interface OwnState {};

//-------------------------------------------

//counter component definition
class CounterComponent extends React.Component<OwnProps & ConnectedState & ConnectedDispatch,OwnState>{
     _onClickIncrement = () => {
        this.props.increment(1);
    }
    render () {
    const { counter, label } = this.props
    return <div>
      <label>{label}</label>
      <pre>counter = {counter.value}</pre>
      <button ref='increment' onClick={this._onClickIncrement}>click me!</button>
    </div>
  }
}


export const Counter: React.ComponentClass<OwnProps> =
  connect(mapStateToProps, mapDispatchToProps)(CounterComponent)