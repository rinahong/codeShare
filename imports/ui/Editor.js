import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';
import Popup from "reactjs-popup";
import Chat from './Chat.js';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Paper, Toolbar, Typography } from '@material-ui/core';
import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import 'brace/mode/jsx';

import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';
import { UserDocuments } from '../api/userDoc';
import CustomOpenEdgeMode from '../customModes/openEdge.js';
import {UserSelection} from './UserSelection.js';
import '../api/aceModes.js'

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
    this.viewUserAvaliable = this.viewUserAvaliable.bind(this);
    this.givePermission = this.givePermission.bind(this);
    this.updateUserPermissionList = this.updateUserPermissionList.bind(this);

    this.state = {
      id: this.props.match.params.id,
      title: "",
      meteorUsers: [],
      userIdsWithPermission: [],
      defaultValue: ""
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];

  }

  componentDidMount() {
    const {id, meteorUsers} = this.state;
    if(!Meteor.userId()) {
      this.props.history.push({
        pathname: "/signin",
        state: { from: this.props.location }
      })
    }

    // Get all users so that we can give permission
    Meteor.call('getAllUsers', (error, result) => {
      if(error) {
        console.log("Can't get users: ", error.reason);
      } else {
        this.setState({meteorUsers: result})
      }
    });

    //Fetch all userDocuments by Document id
    Meteor.call('getUserDocuments', id, (error, result) => {
      if(error) {
        console.log("Can't get UserDocuments: ", error.reason);
      } else {
        var onlyUserIdsByDoc = []
        //Parse userId and store into the array.
        result.map((eachUser)=>{
          onlyUserIdsByDoc.push(eachUser.userId);
        });

        // Exclude users of this document from meteorUsers[] using filter().
        // As we map through onlyUserIdsByDoc,
        // filtering meteorUsers by removing a user by userId.
        onlyUserIdsByDoc.map((userId)=>{
          this.setState({
            meteorUsers: this.state.meteorUsers //Should include this.state!!
              .filter( u => u._id !== userId)
          })
        })
      }
    });

    // Find the document on this editor page for updating title
    Meteor.call('findDocument', id, (error, result) => {
      if(error) {
        console.log("Can't find Document");
      } else {
        this.setState({title: result.title})
      }
    });

	}

  getHeight() {
    return (3 * window.innerHeight) + "px";
  }

  getWidth() {
    return window.innerWidth + "px";
  }

  // onChange Event of input, setState of title
  handleTitleChange (name) {
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
          console.log("Fail to update the document title", error.reason);
        } else {
          console.log("new title saved successfully");
        }
      });
    }
  }

  // Grab a list of user IDs from UserSelection.js
  // and store the list into state of userIdsWithPermission
  updateUserPermissionList(listOfIds) {
    const { id, userIdsWithPermission } = this.state;
    this.setState({
      userIdsWithPermission: listOfIds.split(',')
    })
  }

  // Save all users of the userIdsWithPermission into UserDocuments collection
  givePermission() {
    const { id, userIdsWithPermission } = this.state;
    userIdsWithPermission.map((userId) => {
      Meteor.call('upsertUserDocument', userId, id, (error, result) => {
        if(error) {
          console.log("Fail to upsert the user", error.reason);
        } else {
          console.log("Yay upserted successfully");
        }
      });
      // TODO: Below setState not working properly
      // this.setState({
      //   meteorUsers: this.state.meteorUsers
      //     .filter( u => u._id !== userId)
      // })
      //TODO: Later, write a function to send emails to all permitted users.
    })
  }

  // Display viewUserAvaliable on popup modal and pass props to userSelection.js
  viewUserAvaliable(close){
    const { meteorUsers, userIdsWithPermission } = this.state;
    console.log("meteorUsers", meteorUsers)
    return(
      <div className="modal">
        <a className="close" onClick={close}>
          &times;
        </a>
        <div className="header"> Share with others </div>
        <div className="content">
          <UserSelection meteorUsers={meteorUsers} updateUserPermissionList={this.updateUserPermissionList}/>
        </div>
        <div className="actions">
          <button
            className="button"
            onClick={() => {
              console.log('Permission Sent')
              this.givePermission()
            }}
          >
            SEND
          </button>
          <button
            className="button"
            onClick={() => {
              console.log('modal closed ')
              close()
            }}
          >
            close modal
          </button>
        </div>
      </div>
    )
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

        //==========!!This resolve setState issue!!=======
        this.setState({defaultValue: text});
        //================================================

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
        <Popup trigger={<button className="button"> Open Modal </button>} modal>
          {close => (
            this.viewUserAvaliable(close)
          )}
        </Popup>,
        <Chat key="0" id={this.state.id}/>,
        <AceEditor
        ref="aceEditor"
        key="1"
        mode={this.state.mode}
        theme="monokai"
        name="editor"
        value={this.state.defaultValue}
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
