import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';

import Chat from './Chat.js';
import { DocumentContents} from '../api/DocumentContents.js';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// Render editor
export default class Editor extends Component {

  constructor(props) {
    super(props);

    this.getHeight = this.getHeight.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);

    this.state = {
      id: this.props.match.params.id
    }

  }

  getHeight() {
    return (3 * window.innerHeight) + "px";
  }

  getWidth() {
    return window.innerWidth + "px";
  }

  onChange(value, event) {
    const {row} = event.start;
    const val_arr = value.split('\n');
    const delta = val_arr[row];
    var currentUser = Meteor.userId();

    DocumentContents.insert({
      docId: this.state.id,
      row: event.start.row,
      value: delta,
      createdAt: new Date(), // current time
      writtenBy: currentUser
    }, function(error) {
      if(error) {
        console.log("Accounts.createUser Faild: ",error.reason);
      }
    });

  }

  onLoad(editor) {

      Tracker.autorun(() => {
        let values = [];
        let text = '';
        let prevValue = editor.getValue();
        let data = DocumentContents.find({docId: this.state.id}, {sort: {createdAt: 1}}).fetch();

        if (data) {
          _.map(data, function(row_data) {
              values[row_data.row] = row_data.value;
          })

          text = values.join('\n');
          if (text == prevValue) return;

          editor.setValue(text,1);
        }
      });
  }

  render() {

    const height = this.getHeight(); //window height
    const width = this.getWidth(); //window width

    // check is user is logged in; if not, redirect to login page
    if (Meteor.userId() == null) {
      return (
        <Redirect
            to={{
              pathname: "/signin",
              state: { from: this.props.location }
            }}
          />
        )
    }

    return (
      [<Chat key="0" id={this.state.id}/>,
      <AceEditor
      ref="aceEditor"
      key="1"
      mode="javascript"
      theme="monokai"
      name="editor"
      onLoad={this.onLoad}
      onChange={this.onChange}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      height={height}
      width={width}
      debounceChangePeriod={1000}
      editorProps={{$blockScrolling: Infinity}}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}/>]
    );
  }


}
