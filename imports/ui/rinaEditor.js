
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
    this.viewUserAvaliable = this.viewUserAvaliable.bind(this);
    this.givePermission = this.givePermission.bind(this);
    this.updateUserPermissionList = this.updateUserPermissionList.bind(this);
    var today = new Date()
    var yearAgo = new Date().setDate(today.getDate()-365)

    this.state = {
      id: this.props.match.params.id,
      title: "",
      meteorUsers: [],
      userIdsWithPermission: [],
      firstTimeLoad: true,
      rowContent: [],
      lastTimeInsert: yearAgo, // default 1 year ago.
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];
    this.testPrev = []

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

        // Exclude users of this document from meteorUsers using filter().
        // As we map through onlyUserIdsByDoc,
        // filtering meteorUsers by removing a user by userId.
        onlyUserIdsByDoc.map((userId)=>{
          console.log(userId)
          this.setState({
            meteorUsers: this.state.meteorUsers //Should include this.state!!
              .filter( u => u._id !== userId)
          })
        })

        console.log("final users to display in dropdown",this.state.meteorUsers);
      }
    });

    // Find the document on this editor page for updating title
    Meteor.call('findDocument', id, (error, result) => {
      if(error) {
        console.log("There was an error to retreive Document");
      } else {
        console.log("CALLING DOUCMENT SUCCESS");
      }
    });
  }

  getHeight() {
    return (3 * window.innerHeight) + "px";
  }

  getWidth() {
    return window.innerWidth + "px";
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
        } else {
          console.log("new title saved successfully");
        }
      });
    }
  }

  updateUserPermissionList(listOfIds) {
    this.setState({
      userIdsWithPermission: listOfIds.split(',')
    })
  }

  givePermission() {
    const { id, userIdsWithPermission } = this.state;
    userIdsWithPermission.map((userId) => {
      Meteor.call('upsertUserDocument', userId, id, (error, result) => {
        if(error) {
          console.log("There was an error to upsert");
        } else {
          console.log("Yay upserted successfull");
        }
      });
      // TODO: Below setState not working properly
      this.setState({
        meteorUsers: this.state.meteorUsers
          .filter( u => u._id !== userId)
      })
      //TODO: Later, write a function to send emails to all permitted users.
    })
  }

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

  onCursorChange() {
    const currentUser = Meteor.userId();
    const {rowContent} = this.state;
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
      this.setState({
        rowContent: [contentObj]
      })
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
    const {id, lastTimeInsert, rowContent} = this.state;
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
        // data = DocumentContents.find({writtenBy: currentUser, createdAt: { $gt : new Date(lastTimeInsert)}}, { sort: { createdAt: 1 } }).fetch();
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
      //   this.testPrev = data
      // }

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









// onChange(value, event) {
//
//   const val_arr = value.split('\n');
//   const currentUser = Meteor.userId();
//
//   for (var i = 0; i < val_arr.length; i++) {
//
//     if (val_arr[i] == this.prevValues[i]) continue;
//
//     const delta = val_arr[i];
//
//     DocumentContents.insert({
//       docId: this.state.id,
//       row: i,
//       value: delta,
//       createdAt: new Date(), // current time
//       writtenBy: currentUser
//     }, function (error) {
//       if (error) {
//         console.log("Document save Failed: ", error.reason);
//       }
//     });
//   }
//
// }

  // onLoad(editor) {
  //
  //   Tracker.autorun(() => {
  //     let values = [];
  //     let text = '';
  //     let prevValue = editor.getValue();
  //     let data = DocumentContents.find({ docId: this.state.id }, { sort: { createdAt: 1 } }).fetch();
  //
  //     if (data) {
  //       _.map(data, function (row_data) {
  //         values[row_data.row] = row_data.value;
  //       })
  //
  //       this.prevValues = values;
  //
  //       text = values.join('\n');
  //       if (text == prevValue) return;
  //
  //       editor.setValue(text, 1);
  //     }
  //   });
  // }
