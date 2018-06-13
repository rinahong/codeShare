import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker'
import _ from 'lodash';

import { Documents } from '../api/documents.js';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// Render editor
class Editor extends Component {

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
    Documents.insert({
      id: this.state.id,
      value,
      createdAt: new Date(), // current time
    });
  }

  onLoad(editor) {
    /*
    let document = Documents.findOne({id: this.state.id}, {sort: {createdAt: -1, limit: 1}});
    if (document) {
      editor.setValue(document.value);
    }*/
    
    Tracker.autorun(() => {
       let document = Documents.findOne({id: this.state.id}, {sort: {createdAt: -1, limit: 1}});
       if (document) {
         editor.setValue(document.value);
       }
    });
    
  }

  render() {
    console.log(this.props.document);

    const {id} = this.props.match.params; //document ID
    const height = this.getHeight(); //window height
    const width = this.getWidth(); //window width
    const value = this.props.document ? this.props.document.value : '';

    // check is user is logged in; if not, redirect to login page
    if (Meteor.userId() == null) {
      return (
        <Redirect
            to={{
              pathname: "/",
              state: { from: this.props.location }
            }}
          />
        )
    }

    const onChange = _.debounce((value, event) => {this.onChange(value, event)}, 3000);

    return (
      <AceEditor
      mode="javascript"
      theme="monokai"
      name="editor"
      onLoad={this.onLoad}
      onChange={onChange}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      height={height}
      width={width}
      value={value}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}/>
    );
  }
}

export default withTracker(() => {
  if (this.state) {
    return {
      document: Documents.findOne({id: this.state.id}, {sort: {createdAt: -1, limit: 1}})
    };
  }
  return {};
})(Editor);
