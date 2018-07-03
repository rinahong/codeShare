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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      onLoadStatus: false,
      onChangeStatus: false
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
          if(_.isEmpty(result)) {
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
        this.setState({
          title: result.title,
          documentCreatedBy: result.createdBy,
          mode: (result.mode != "") ? result.mode : "javascript" //default mode is JS
        })
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
          console.log("New title saved successfully");
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
    var tempAvailableUsersForPermission = this.state.availableUsersForPermission;

    userIdsWithPermission.map((userId) => {
      Meteor.call('upsertUserDocument', userId, id, documentCreatedBy, (error, result) => {
        if (error) {
          console.log("Fail to upsert the user", error.reason);
        } else {
          console.log("Yay upserted successfully");
        }
      });

      // Exclude user(s) who just permitted to this document.
      tempAvailableUsersForPermission = tempAvailableUsersForPermission
        .filter( user => user._id !== userId)

      //TODO: Later, write a function to send emails to all permitted users.
    });

    // Update availableUsersForPermission with tempAvailableUsersForPermission
    this.setState({
      availableUsersForPermission: tempAvailableUsersForPermission
    })

  }

  setMode(e) {
    const {id, mode} = this.state;
    if(this.state.mode = 'openedge') {
      this.refs.aceEditor.editor.getSession().setMode(customMode);
    }

    this.setState({
      mode: e.target.value
    })

    Meteor.call('updateMode', id, e.target.value, (error) => {
      if(error) {
        console.log("Fail to update the document mode", error.reason);
      } else {
        console.log("Mode updated successfully");
      }
    });
  }

  onChange(value, event) {
    this.setState({ defaultValue: value })

    //If onLoad() not yet called, we can set onChange: true
    if (this.state.onLoadStatus == false ) {
      this.setState({ onChangeStatus: true })
    } else if (this.state.onLoadStatus == true ) {
      this.setState({ onLoadStatus: false })
    }

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
        } else{
          console.log("Inserted successfully")
        }
      });
    }

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
        this.setState({ onLoadStatus: true });
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

          //If onChange was called before onLoad,
          //Then we can update prevValues, and onChangeStatus = false
          if(this.state.onChangeStatus == true) {
            this.prevValues = editor.getValue().split('\n');
            this.setState({ onChangeStatus: false })
          }
          this.setState({ defaultValue: editor.getValue() })
        }
      }
    });
  }

  deleteDocument(documentId) {
      const { documents } = this.state;
      // Meteor.method "deleteDocument" will remove Document from mongoDB.
      Meteor.call('deleteDocument', documentId, (error, result) => {
        if (error) {
          console.log("There was an error to retreive Document list");
        } else {
          // Remove the document from the state, so that, remove the document from the LandingPage.
          console.log("got deleted bro")
          // this.setState({
          //   documents: documents.filter(doc => doc._id !== documentId)
          // }); WHAT DOES THIS DO?
          this.props.history.push("/me/documents")
          
        }
      });


    
  }

  redirectToLanding() {

  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  

  render() {
    const { availableUsersForPermission, userIdsWithPermission, title } = this.state;
    const height = editorFunctions.getHeight(); //window height
    const width = editorFunctions.getWidth(); //window width
    const { classes } = this.props;

    return (
      <NavBarEditor title={title} 
      titleonChange={this.handleTitleChange('title')} 
      titleonBlur={this.updateDocument()} handleModalOpen={this.handleModalOpen} 
      handleModalClose={this.handleModalClose}
      handleDialogOpen={this.handleDialogOpen}>
        <div key="0">
        </div>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete this document?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => {
              console.log('Just got deleted ' + this.state.id)
              this.deleteDocument(this.state.id)
              console.log('Just got deleted 2 ' + this.state.id)
              this.handleDialogClose()}}
            color="primary">
              Yes
            </Button>
            <Button onClick={this.handleDialogClose} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
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
          <Paper style={{padding: '15px 30px 30px 30px'}}>
            <div className="content" style={{ fontFamily: 'Roboto' }}>
              <h3> Share with others </h3>

              <UserSelection availableUsersForPermission={availableUsersForPermission} 
              updateUserPermissionList={this.updateUserPermissionList} 
              />
            </div>
            <div className="actions" >
                <Button
                  variant="contained" 
                  color="primary"
                  className="button"
                  onClick={() => {
                    console.log('Permission Sent')
                    this.givePermission()
                    this.handleModalClose()

                  }}
                  style={{ color: "white", marginTop: '4%'}}
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
