import React, { Component } from 'react';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import { withTracker } from 'meteor/react-meteor-data';

import { Messages } from '../api/messages.js';

import 'react-chat-widget/lib/styles.css';


class Chat extends Component {

  handleNewUserMessage = (newMessage) => {

    Messages.insert({
      id: "1234",
      message: `${newMessage}`,
      createdAt: new Date(), // current time
      user: Meteor.userId()
    });

  }

  render() {

    if (this.props.message && this.props.message.user != Meteor.userId()) {
      addResponseMessage(this.props.message.message);
    }

    const subtitle = "Document " + this.props.id;

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title="Messenger"
          subtitle={subtitle}
        />
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    message: Messages.findOne({}, {sort: {createdAt: -1, limit: 1}})
  };
})(Chat);
