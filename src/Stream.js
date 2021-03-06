import React, { Component, } from 'react'
import { func, } from 'prop-types'

import { Subject, } from './utils'

class StreamRenderer extends Component {
  constructor (props) {
    super(props)

    this.unsubscribed = false
    this.subject = new Subject()
  }

  componentDidMount () {
    const vdom$ = this.props.render(this.subject)
    this.subscription = vdom$.subscribe({
      next: vdom =>
        this.setState({
          vdom,
        }),
    })
    this.notify(this.props)
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    this.notify(nextProps)
  }

  componentWillUnmount () {
    this.subscription && this.subscription.unsubscribe()
    this.unsubscribed = true
  }

  state = { vdom: null, }

  notify = props => {
    !this.unsubscribed && this.subject && this.subject.next(props)
  }

  render () {
    return this.state.vdom
  }
}

StreamRenderer.propTypes = {
  render: func,
}

const Stream = ({ children, ...props }) => <StreamRenderer {...{ ...props, }} render={children} />

export default Stream
