
import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';
import Popup from "reactjs-popup";

import Chat from './Chat.js';
import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';
import { UserDocuments } from '../api/userDoc';
import CustomOpenEdgeMode from '../customModes/openEdge.js';
import {UserSelection} from './UserSelection.js';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// Render editor
export class Editor extends Component {

  constructor(props) {
    super(props);

    this.getHeight = this.getHeight.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    var today = new Date()
    var yearAgo = new Date().setDate(today.getDate()-365)

    this.state = {
      id: this.props.match.params.id,
      firstTimeLoad: true,
      // rowContent: [],
      lastTimeInsert: yearAgo, // default 1 year ago.
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];

  }

  componentDidMount() {
    const {id} = this.state;
		const customMode = new CustomOpenEdgeMode();
    if(Meteor.userId()) {
      this.refs.aceEditor.editor.getSession().setMode(customMode);
    } else {
      this.props.history.push({
        pathname: "/signin",
        state: { from: this.props.location }
      })
    }
  }

  getHeight() {
    return (3 * window.innerHeight) + "px";
  }

  getWidth() {
    return window.innerWidth + "px";
  }

  onCursorChange() {
    const currentUser = Meteor.userId();
    // const {rowContent} = this.state;
    var selectionRange = this.refs.aceEditor.editor.getSelectionRange();
    var currentLine = selectionRange.start.row;
    var content = this.refs.aceEditor.editor.session.getLine(currentLine);
    var contentObj = {}
    if(content) {
      contentObj['docId'] = this.state.id;
      contentObj['row'] = currentLine;
      contentObj['value'] = content;
      contentObj['writtenBy'] = currentUser;
      // Append new content object to existing rowContent state.
      // this.setState({
      //   rowContent: [contentObj]
      // })
    }
  }

  onChange(value, event) {

    const val_arr = value.split('\n');
    const currentUser = Meteor.userId();
    for (var i = 0; i < val_arr.length; i++) {

      if (val_arr[i] == this.prevValues[i]) continue;

      const delta = val_arr[i];
      console.log("delta", val_arr[i])
      DocumentContents.insert({
        docId: this.state.id,
        row: i,
        value: delta,
        createdAt: new Date(), // current time
        writtenBy: currentUser
      }, function(error) {
        if(error) {
          console.log("Document save Failed: ",error.reason);
        } else{
          console.log("insert done")
          // this.setState({rowContent: []})
        }
      });
    }

  }

  onLoad(editor) {
    const currentUser = Meteor.userId();
    const {id, lastTimeInsert} = this.state;
    let firstTimeLoad = true;
    console.log("onload")
    Tracker.autorun(() => {
      console.log("on load is runnign")
      let values = [];
      let text = '';
      let prevValue = editor.getValue();
      let data = [];
      if (firstTimeLoad) {
        console.log("in first time load")
        data = DocumentContents.find({ docId: id }, { sort: { createdAt: 1 } }).fetch();
        if(!(_.isEmpty(data))) {
          firstTimeLoad = false
        }
      } else {
        console.log("NOT first time load")
        data = DocumentContents.find({docId: id, writtenBy: { $not: currentUser }, createdAt: { $gt : new Date(lastTimeInsert)}}, { sort: { createdAt: 1 } }).fetch();
      }

      if (data) {
        _.map(data, function (row_data) {
          console.log("row_data",row_data.row, " ",row_data.value)
          editor.session.replace({
              start: {row: row_data.row, column: 0},
              end: {row: row_data.row, column: Number.MAX_VALUE}
          }, row_data.value)

          //============= remove line first and insert ==========
          // editor.selection.moveCursorToPosition({row: row_data.row, column: 0});
          // editor.selection.selectLine();
          // editor.removeLines()
          // editor.session.insert({row:row_data.row, column:0}, row_data.value);
          //=====================================================
        })
      }

      // data = DocumentContents.find({ docId: id }, { sort: { createdAt: 1 } }).fetch();
      //
      // if (data) {
      //   _.map(data, function (row_data) {
      //     values[row_data.row] = row_data.value;
      //   })
      //
      //   this.prevValues = values;
      //
      //   text = values.join('\n');
      //   if (text == prevValue) return;
      //
      //   editor.setValue(text, 1);
      // }

    });
  }

  render() {
    const height = this.getHeight(); //window height
    const width = this.getWidth(); //window width

    return (
      [
        <Chat key="0" id={this.state.id}/>,
        <AceEditor
        ref="aceEditor"
        key="1"
        mode="javascript"
        theme="monokai"
        name="editor"
        onLoad={this.onLoad}
        onChange={this.onChange}
        onCursorChange={this.onCursorChange}
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        height={height}
        width={width}
        debounceChangePeriod={1000}
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}/>
      ]
    );
  }
}
