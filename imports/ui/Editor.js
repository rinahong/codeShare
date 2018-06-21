import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';

import Chat from './Chat.js';
import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';
import CustomOpenEdgeMode from '../customModes/openEdge.js';

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

    this.state = {
      id: this.props.match.params.id,
      title: ""
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];

  }

  componentDidMount() {
    const {id} = this.state;
		const customMode = new CustomOpenEdgeMode();
		this.refs.aceEditor.editor.getSession().setMode(customMode);

    // Find the document on this editor page.
    Meteor.call('findDocument', id, (error, result) => {
      if(error) {
        console.log("There was an error to retreive Document");
      } else {
        this.setState({ title: result.title });
      }
    });
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
      }, function(error) {
        if(error) {
          console.log("Document save Failed: ",error.reason);
        }
      });
    }

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

          this.prevValues = values;

          text = values.join('\n');
          if (text == prevValue) return;

          editor.setValue(text,1);
        }
      });
  }

  handleTitleChange (name) {
    const {title} = this.state;
    return event => {
      const {currentTarget} = event;
      this.setState({[name]: currentTarget.value});
    };
  }

  //Update title of the document when onBlur.
  updateDocument() {
    const {id, title} = this.state;
    return () => {
      Meteor.call('updateTitle', id, title, (error) => {
        if(error) {
          console.log("There was an error to retreive Document list");
        }
      });
    }
  }

  render() {
    const {title} = this.state;
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
      [
        <div>
          <input
            value={title}
            onChange={this.handleTitleChange('title')}
            onBlur={this.updateDocument()}
            type='title'
            id='title'
            name='title'
          />
        </div>,
        <Chat key="0" id={this.state.id}/>,
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
        }}/>
      ]
    );
  }


}
