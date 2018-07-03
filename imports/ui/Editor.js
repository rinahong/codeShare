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
import NavBarEditor from '../ui/NavBarEditor';

import 'brace/snippets/javascript';
import 'brace/theme/monokai';
import 'brace/mode/jsx';

import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';
import { UserDocuments } from '../api/userDoc';
import CustomOpenEdgeMode from '../customModes/openEdge.js';
import { UserSelection } from './UserSelection.js';
import { editorFunctions, editorVariables } from '../api/editorFunctions.js';
import '../api/aceModes.js'

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const customMode = new CustomOpenEdgeMode();


// Render editor
export class Editor extends Component {
  constructor(props) {
    super(props);

    this.setMode = this.setMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.givePermission = this.givePermission.bind(this);
    this.updateUserPermissionList = this.updateUserPermissionList.bind(this);

    const today = new Date();
    const yearAgo = new Date().setDate(today.getDate() - 365);



    this.state = {
      id: this.props.match.params.id,
      title: "",
      documentCreatedBy: "",
      availableUsersForPermission: [],
      userIdsWithPermission: [],
      firstTimeLoad: true,
      mode: "",
      defaultValue: "",
      modalOpen: false,
    }

    // I hate this... but need non-reactive variables
    this.prevValues = [];
    this.lastTimeInsert = yearAgo;
  }

  componentDidMount() {
    const { id, availableUsersForPermission } = this.state;
    const currentUser = Meteor.userId();
    if (!currentUser) {
      this.props.history.push({
        pathname: "/signin",
        state: { from: this.props.location }
      })
    } else {
      Meteor.call('quickUserSearchInUserDoc', currentUser, id, (error, result) => {
        if (error) {
          console.log("Can't get users: ", error.reason);
        } else {
          console.log("result user :  ", result);
          if (_.isEmpty(result)) {
            alert("You are not authorized...")
            this.props.history.push({
              pathname: "/me/documents"
            })
          }
        }
      });
    }

    // Find the document on this editor page for updating title
    Meteor.call('findDocument', id, (error, result) => {
      if (error) {
        console.log("Can't find Document");
      } else {
        console.log("result.mode", result.mode)
        this.setState({
          title: result.title,
          documentCreatedBy: result.createdBy,
          mode: (result.mode != "") ? result.mode : "javascript" //default mode is JS
        })
        console.log("current mode", this.state.mode)
      }
    });

    // Get all users so that we can give permission
    Meteor.call('getAllUsers', (error, result) => {
      if (error) {
        console.log("Can't get users: ", error.reason);
      } else {
        this.setState({ availableUsersForPermission: result })
      }
    });

    //Fetch all userDocuments by Document id
    Meteor.call('getAllUsersByDocument', id, (error, result) => {
      if (error) {
        console.log("Can't get UserDocuments: ", error.reason);
      } else {
        var onlyUserIdsByDoc = []
        //Parse userId and store into the array.
        onlyUserIdsByDoc = result.map((eachUser) => {
          return eachUser.userId
        });

        // Exclude users who already belongs to this document.
        // As we map through onlyUserIdsByDoc,
        // filtering availableUsersForPermission by removing a user by userId.
        onlyUserIdsByDoc.map((userId) => {
          this.setState({
            availableUsersForPermission: this.state.availableUsersForPermission //Should include this.state!!
              .filter(u => u._id !== userId)
          })
        })
      }
    });

  }

  // onChange Event of input, setState of title
  handleTitleChange(name) {
    return event => {
      const { currentTarget } = event;
      this.setState({ [name]: currentTarget.value });
    };
  }

  //Update title of the document when onBlur.
  updateDocument() {
    const { id, title } = this.state;
    return () => {
      Meteor.call('updateTitle', id, title, (error) => {
        if (error) {
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
    const { id, userIdsWithPermission, documentCreatedBy } = this.state;
    userIdsWithPermission.map((userId) => {
      Meteor.call('upsertUserDocument', userId, id, documentCreatedBy, (error, result) => {
        if (error) {
          console.log("Fail to upsert the user", error.reason);
        } else {
          console.log("Yay upserted successfully");
        }
      });
      // TODO: Below setState not working properly
      // this.setState({
      //   availableUsersForPermission: this.state.availableUsersForPermission
      //     .filter( u => u._id !== userId)
      // })
      //TODO: Later, write a function to send emails to all permitted users.
    })
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
    const { id, mode } = this.state;
    if (this.state.mode = 'openedge') {
      this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    this.setState({
      mode: e.target.value
    })

    Meteor.call('updateMode', id, e.target.value, (error) => {
      if (error) {
        console.log("Fail to update the document mode", error.reason);
      } else {
        console.log("Mode updated successfully");
      }
    });
  }

  onLoad(editor) {
    const currentUser = Meteor.userId();
    let { id } = this.state;
    let numRowsStored = 0;
    let numRowsCurrent = 0;

    Tracker.autorun(() => {
      let values = [];
      let text = '';
      let prevValue = editor.getValue();
      let data = [];

      if (this.state.firstTimeLoad) {
        data = DocumentContents.find({ docId: id }, { sort: { createdAt: 1 } }).fetch();
        if (!(_.isEmpty(data))) {
          _.map(data, function (row_data) {
            values[row_data.row] = row_data.value;
          })

          this.prevValues = values;
          this.lastTimeInsert = DocumentContents.findOne({ docId: id }, { sort: { createdAt: -1, limit: 1 } }).createdAt;

          text = values.join('\n');
          if (text == prevValue) return;

          editor.setValue(text, 1);
          this.setState({ firstTimeLoad: false, defaultValue: text });
        }
      } else {
        data = DocumentContents.find({ docId: id, writtenBy: { $not: currentUser }, createdAt: { $gt: new Date(this.lastTimeInsert) } }, { sort: { createdAt: 1 } }).fetch();

        if (data) {
          numRowsStored = DocumentContents.findOne({ docId: id }, { sort: { row: -1, limit: 1 } }).row + 1;
          numRowsCurrent = editor.session.getLength();

          if (numRowsStored > numRowsCurrent) {
            editorFunctions.padDocument(editor, numRowsCurrent, numRowsStored);
          }

          _.map(data, function (row_data) {

            editor.session.replace({
              start: { row: row_data.row, column: 0 },
              end: { row: row_data.row, column: Number.MAX_VALUE }
            }, row_data.value)

          })

          this.lastTimeInsert = DocumentContents.findOne({ docId: id }, { sort: { createdAt: -1, limit: 1 } }).createdAt;
          this.prevValues = editor.getValue().split('\n');

          this.setState({ defaultValue: editor.getValue() })
        }
      }
    });
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  render() {
    const { availableUsersForPermission, userIdsWithPermission, title } = this.state;
    const height = editorFunctions.getHeight(); //window height
    const width = editorFunctions.getWidth(); //window width
    const { classes } = this.props;

    return (
      <NavBarEditor title={title} titleonChange={this.handleTitleChange('title')} titleonBlur={this.updateDocument()} handleModalOpen={this.handleModalOpen} handleModalClose={this.handleModalClose}>
        <div key="0">
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleModalClose}
          style={{
            position: 'absolute',
            width: '50%',
            // height: '50%',
            backgroundColor: 'paper',
            // boxShadow: theme.shadows[5],
            // padding: '30px',
            top: '40%',
            left: '25%',
          }}
        >
          <Paper style={{padding: '30px'}}>
            <div className="header"> Share with others </div>
            <div className="content">
              <UserSelection availableUsersForPermission={availableUsersForPermission} updateUserPermissionList={this.updateUserPermissionList} />
            </div>
            <div className="actions" >
                <Button
                  className="button"
                  onClick={() => {
                    console.log('Permission Sent')
                    this.givePermission()
                    this.handleModalClose()

                  }}
                >
                  Done
                </Button>
            </div>
          </Paper>
        </Modal>
        <Chat key="2" id={this.state.id} />
        <AceEditor
          ref="aceEditor"
          key="3"
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
          width="100%"
          debounceChangePeriod={1000}
          editorProps={{ $blockScrolling: Infinity }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }} />

        <Paper key="4" style={editorVariables.statusBarStyle} position='fixed' color="default">
          <Select name="mode" onChange={this.setMode} value={this.state.mode}>
            Mode: {editorVariables.languages.map((lang) => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
          </Select>
        </Paper>
      </NavBarEditor>

    );
  }
}
