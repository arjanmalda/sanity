/* eslint-disable react/no-unused-prop-types */

// A simple focus path manager

import React from 'react'
import {Path} from '@sanity/types'

type Props = {
  path: any | null
  onFocus: () => void
  onBlur: () => void
  children: (arg: any) => any
}

type State = {
  focusPath: Array<any>
}

export class SimpleFocusManager extends React.Component<Props, State> {
  state = {
    focusPath: [],
  }

  handleFocus = (path: Path) => {
    this.setState({focusPath: path})
  }

  handleBlur = () => {
    // do nothing
  }

  render() {
    return this.props.children({
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      focusPath: this.state.focusPath,
    })
  }
}