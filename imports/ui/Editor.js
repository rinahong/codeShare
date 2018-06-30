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

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { Paper, Toolbar, Typography } from '@material-ui/core';


import '../api/aceModes.js'
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import 'brace/mode/jsx';

const languages = [
  'openedge',
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css',
]

const statusBarStyle = {
  zIndex: '9999',
  bottom: '0',
  position: 'fixed'
};

const customMode = new CustomOpenEdgeMode();


// Render editor
export class Editor extends Component {


  constructor(props) {
    super(props);

    this.setMode = this.setMode.bind(this);
    this.getHeight = this.getHeight.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);

    this.state = {
      id: this.props.match.params.id,
      title: "",
      meteorUsers: [],
      userIdsWithPermission: []
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];

  }

  componentDidMount() {
    const {id, meteorUsers} = this.state;
    if(Meteor.userId()) {
      // this.refs.aceEditor.editor.getSession().setMode({this.state.mode});
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

  onChange(value, event) {

    const val_arr = value.split('\n');
    const currentUser = Meteor.userId();

    for (var i = 0; i < val_arr.length; i++) {

      if (val_arr[i] == this.prevValues[i]) continue;

      const delta = val_arr[i];

      DocumentContents.insert({
        docId: this.state.id,
        row: i,
        value: delta,
        createdAt: new Date(), // current time
        writtenBy: currentUser
      }, function (error) {
        if (error) {
          console.log("Document save Failed: ", error.reason);
        }
      });
    }

  }

  setMode(e) {

    if(this.state.mode = 'openedge') {
      this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    this.setState({
      mode: e.target.value
    })
  }

  onLoad(editor) {

    Tracker.autorun(() => {
      let values = [];
      let text = '';
      let prevValue = editor.getValue();
      let data = DocumentContents.find({ docId: this.state.id }, { sort: { createdAt: 1 } }).fetch();

      if (data) {
        _.map(data, function (row_data) {
          values[row_data.row] = row_data.value;
        })

        this.prevValues = values;

        text = values.join('\n');
        if (text == prevValue) return;

        editor.setValue(text, 1);
      }
    });
  }

  render() {
    const {title} = this.state;
    const height = this.getHeight(); //window height
    const width = this.getWidth(); //window width

    return (
      [
        <Chat key="0" id={this.state.id}/>,
        <AceEditor
        ref="aceEditor"
        key="1"
        mode={this.state.mode}
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
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}/>,

        <Paper style={statusBarStyle} position='fixed' color="default">
        <Select name="mode" onChange={this.setMode} value={this.state.mode}>
                  Mode: {languages.map((lang) => <MenuItem  key={lang} value={lang}>{lang}</MenuItem>)}
        </Select>
        </Paper>
      ]
    );
  }
}
