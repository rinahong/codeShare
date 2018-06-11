import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

// Render editor
export default class Editor extends Component {
  constructor(props) {
    super(props);

    this.getHeight = this.getHeight.bind(this);
    this.getWidth = this.getWidth.bind(this);
  }

  getHeight() {
    return (3 * window.innerHeight) + "px";
  }

  getWidth() {
    return window.innerWidth + "px";
  }


  render() {
    const {id} = this.props.match.params; //document ID
    const height = this.getHeight(); //window height
    const width = this.getWidth(); //window width

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

    return (
      <AceEditor
      mode="javascript"
      theme="monokai"
      name="editor"
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      height={height}
      width={width}
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
