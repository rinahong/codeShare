import React, { Component } from 'react';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { Messages } from '../api/messages.js';

import 'react-chat-widget/lib/styles.css';


export default class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      getAll: true
    }
  }

  componentDidMount() {
    Tracker.autorun(() => {
        if (this.state) {
          // load all messages at first
          if (this.state.getAll) {
            let messages = Messages.find({id: this.state.id}, {sort: {createdAt: -1}}).fetch();
            if (!messages.length) return;

            _.map(messages, function(message) {
                message.user == Meteor.userId() ? addUserMessage(message.message) : addResponseMessage(message.message);
            });
            this.setState({getAll: false});
          }
          else {
            let messages = Messages.findOne({id: this.state.id}, {sort: {createdAt: -1, limit: 1}});
            if (messages && messages.user != Meteor.userId()) {
              addResponseMessage(messages.message);
            }
          }
        }
    });
  }

  handleNewUserMessage = (newMessage) => {

    Messages.insert({
      id: this.state.id,
      message: `${newMessage}`,
      createdAt: new Date(), // current time
      user: Meteor.userId()
    });

  }

  render() {

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
