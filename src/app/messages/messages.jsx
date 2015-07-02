/* global React */
'use strict';

let Reflux = window.require('reflux');
import Message from './messages.message.jsx';
import MessagesStore from './messages.store.jsx';

export default React.createClass({
  displayName: 'ChatMessages',

  mixins: [
    Reflux.listenTo(MessagesStore, 'onChange')
  ],

  getInitialState () {
    return { messages: [] }
  },

  componentWillMount () {
    // get all messages
  },

  onChange (newMessage) {
    let obj = this.state.messages.concat([newMessage]);
    this.setState({ messages: obj });
  },

  render () {
    return (
      <div>
        {this.state.messages.map((data) => {
          return (
            <p><span>{data.user}</span>: {data.message}</p>
          )
        })}
      </div>
    )
  }
});
