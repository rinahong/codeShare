
import React, { Component } from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import { Redirect } from 'react-router-dom';
import { Tracker } from 'meteor/tracker';
import _ from 'lodash';

import Chat from './Chat.js';
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
      id: this.props.match.params.id
    }

    // I hate this... but need a non-reactive variable
    this.prevValues = [];

  }

  componentDidMount() {
		const customMode = new CustomOpenEdgeMode();
		this.refs.aceEditor.editor.getSession().setMode(customMode);
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
      const {id} = this.state;
      Tracker.autorun(() => {
        let values = [];
        let text = '';
        let prevValue = editor.getValue();
        Meteor.subscribe("DocumentContents", id, {
          onReady: function () {
            let data = DocumentContents.find({docId: id}, {sort: {createdAt: 1}}).fetch();
            if (data) {
              _.map(data, function(row_data) {
                  values[row_data.row] = row_data.value;
              })

              this.prevValues = values;

              text = values.join('\n');
              if (text == prevValue) return;

              editor.setValue(text,1);
            }

          }.bind(this),

          onStop: function () {
           // called when data publication is stopped
           console.log("users in onStop", meteorUsers);
          }
        });

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







// import React, { Component } from 'react';
// import { render } from 'react-dom';
// import brace from 'brace';
// import AceEditor from 'react-ace';
// import { Redirect } from 'react-router-dom';
// import { Tracker } from 'meteor/tracker';
// import _ from 'lodash';
// import Popup from "reactjs-popup";
//
// import Chat from './Chat.js';
// import { Documents } from '../api/documents.js';
// import { DocumentContents } from '../api/documentContents.js';
// import { UserDocuments } from '../api/userDoc';
// import CustomOpenEdgeMode from '../customModes/openEdge.js';
// import {UserSelection} from './UserSelection.js';
//
// import 'brace/mode/javascript';
// import 'brace/theme/monokai';
//
// // Render editor
// export class Editor extends Component {
//
//   constructor(props) {
//     super(props);
//
//     this.getHeight = this.getHeight.bind(this);
//     this.getWidth = this.getWidth.bind(this);
//     this.onChange = this.onChange.bind(this);
//     this.onLoad = this.onLoad.bind(this);
//     this.viewUserAvaliable = this.viewUserAvaliable.bind(this);
//     this.givePermission = this.givePermission.bind(this);
//     this.updateUserPermissionList = this.updateUserPermissionList.bind(this);
//     this.onCursorChange = this.onCursorChange.bind(this);
//
//     var today = new Date()
//     var yearAgo = new Date().setDate(today.getDate()-365)
//
//     this.state = {
//       id: this.props.match.params.id,
//       title: "",
//       meteorUsers: [],
//       userIdsWithPermission: [],
//       firstTimeLoad: true,
//       rowContent: [],
//       lastTimeInsert: today.getYear() // default 1 year ago.
//     }
//
//     // I hate this... but need a non-reactive variable
//     this.prevValues = [];
//   }
//
//   componentDidMount() {
//     const {id, meteorUsers} = this.state;
// 		const customMode = new CustomOpenEdgeMode();
//     if(Meteor.userId()) {
//       this.refs.aceEditor.editor.getSession().setMode(customMode);
//     } else {
//       this.props.history.push({
//         pathname: "/signin",
//         state: { from: this.props.location }
//       })
//     }
//
//     if (Meteor.isClient) {
//       Meteor.subscribe("users", {
//         onReady: function () {
//           this.setState({meteorUsers: Meteor.users.find({}).fetch()})
//         }.bind(this),
//
//         onStop: function () {
//          // called when data publication is stopped
//          console.log("users in onStop", meteorUsers)
//         }
//       });
//
//       Meteor.subscribe("usersByDoc", id, {
//         onReady: function () {
//           var onlyUserIdsByDoc = [];
//
//           //Fetch all userDocuments by Document id and parse userId to store in the array.
//           UserDocuments.find({ docId: id }).fetch().map((eachUser)=>{
//             onlyUserIdsByDoc.push(eachUser.userId);
//           });
//
//           console.log("onlyUserIdsByDoc", onlyUserIdsByDoc);
//
//           // Exclude users of document from meteorUsers.
//           // As we map through onlyUserIdsByDoc,
//           // filtering meteorUsers by removing a user by userId.
//           onlyUserIdsByDoc.map((userId)=>{
//             console.log(userId)
//             this.setState({
//               meteorUsers: this.state.meteorUsers
//                 .filter( u => u._id !== userId)
//             })
//           })
//           console.log("final!",this.state.meteorUsers);
//
//         }.bind(this),
//
//         onStop: function () {
//          // called when data publication is stopped
//          console.log("users in onStop", meteorUsers);
//         }
//       });
//     }
//
//     // Find the document on this editor page.
//     Meteor.call('findDocument', id, (error, result) => {
//       if(error) {
//         console.log("There was an error to retreive Document");
//       } else {
//         this.setState({ title: result.title });
//       }
//     });
// 	}
//
//   getHeight() {
//     return (3 * window.innerHeight) + "px";
//   }
//
//   getWidth() {
//     return window.innerWidth + "px";
//   }
//
//   onCursorChange() {
//     const currentUser = Meteor.userId();
//     const {rowContent} = this.state;
//     var selectionRange = this.refs.aceEditor.editor.getSelectionRange();
//     var currentLine = selectionRange.start.row;
//     var content = this.refs.aceEditor.editor.session.getLine(currentLine);
//     var contentObj = {}
//     console.log("on cursor change: ", content);
//     // if(content) {
//     //   contentObj['docId'] = this.state.id;
//     //   contentObj['row'] = currentLine;
//     //   contentObj['value'] = content;
//     //   contentObj['writtenBy'] = currentUser;
//     //   // Append new content object to existing rowContent state.
//     //   this.setState({
//     //     rowContent: [contentObj]
//     //   })
//     //   console.log("rowContent: ", rowContent);
//     // }
//   }
//
//   // onChange(value, event) {
//   //   const{rowContent, lastTimeInsert} = this.state;
//   //   const varThis = this;
//   //   const tempRowContent = rowContent;
//   //   const currentUser = Meteor.userId();
//   //   // tempRowContent.map((content) => {
//   //   //   DocumentContents.insert({...content, createdAt: new Date()} , function (error) {
//   //   //     if (error) {
//   //   //       console.log("Document save Failed: ", error.reason);
//   //   //     } else {
//   //   //       console.log("Document save Successful")
//   //   //     }
//   //   //   });
//   //   // });
//   //
//   //   this.setState({
//   //     rowContent: [],
//   //     lastTimeInsert: new Date()
//   //   });
//   //   console.log('rowContent: ', rowContent)
//   // }
//
//
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
//
//   // onLoad(editor) {
//   //   const currentUser = Meteor.userId();
//   //   const {firstTimeLoad ,rowContent} = this.state;
//   //   console.log("onLoad rowContent: ", rowContent);
//   //   Tracker.autorun(() => {
//   //     let values = [];
//   //     let text = '';
//   //     let prevValue = editor.getValue();
//   //     let data = [];
//   //     if (firstTimeLoad) {
//   //        data = DocumentContents.find({ docId: this.state.id }, { sort: { createdAt: 1 } }).fetch();
//   //       this.setState({ firstTimeLoad: false })
//   //     } else {
//   //       data = DocumentContents.find({ userId: { $not: currentUser }, createdAt: { $gt: lastTimeInsert } }, { sort: { createdAt: 1 } }).fetch();
//   //     }
//   //
//   //     if (data) {
//   //       _.map(data, function (row_data) {
//   //         editor.session.insert({row:row_data.row, column:0}, row_data.value);
//   //       })
//   //   });
//   // }
//
//   onLoad(editor) {
//
//     Tracker.autorun(() => {
//       let values = [];
//       let text = '';
//       let prevValue = editor.getValue();
//       let data = DocumentContents.find({ docId: this.state.id }, { sort: { createdAt: 1 } }).fetch();
//
//       if (data) {
//         _.map(data, function (row_data) {
//           values[row_data.row] = row_data.value;
//         })
//
//         this.prevValues = values;
//
//         text = values.join('\n');
//         if (text == prevValue) return;
//
//         editor.setValue(text, 1);
//       }
//     });
//   }
//
//
//   handleTitleChange (name) {
//     const {title} = this.state;
//     return event => {
//       const {currentTarget} = event;
//       this.setState({[name]: currentTarget.value});
//     };
//   }
//
//   //Update title of the document when onBlur.
//   updateDocument() {
//     const {id, title} = this.state;
//     return () => {
//       Meteor.call('updateTitle', id, title, (error) => {
//         if(error) {
//           console.log("There was an error to retreive Document list");
//         }
//       });
//     }
//   }
//
//   updateUserPermissionList(listOfIds) {
//     this.setState({
//       userIdsWithPermission: listOfIds.split(',')
//     })
//   }
//
//   givePermission() {
//     const { id, userIdsWithPermission } = this.state;
//     userIdsWithPermission.map((userId) => {
//       Meteor.call('upsertUserDocument', userId, id, (error, result) => {
//         if(error) {
//           console.log("There was an error to upsert");
//         } else {
//           console.log("Yay upserted successfull");
//         }
//       });
//       // TODO: Below setState not working properly
//       // this.setState({
//       //   meteorUsers: this.state.meteorUsers
//       //     .filter( u => u._id !== userId)
//       // })
//       //TODO: Later, write a function to send emails to all permitted users.
//     })
//   }
//
//   viewUserAvaliable(close){
//     const { meteorUsers, userIdsWithPermission } = this.state;
//     return(
//       <div className="modal">
//         <a className="close" onClick={close}>
//           &times;
//         </a>
//         <div className="header"> Share with others </div>
//         <div className="content">
//           <UserSelection meteorUsers={meteorUsers} updateUserPermissionList={this.updateUserPermissionList}/>
//         </div>
//         <div className="actions">
//           <button
//             className="button"
//             onClick={() => {
//               console.log('Permission Sent')
//               this.givePermission()
//             }}
//           >
//             SEND
//           </button>
//           <button
//             className="button"
//             onClick={() => {
//               console.log('modal closed ')
//               close()
//             }}
//           >
//             close modal
//           </button>
//         </div>
//       </div>
//     )
//   }
//
//   render() {
//     const {title} = this.state;
//     const height = this.getHeight(); //window height
//     const width = this.getWidth(); //window width
//
//     return (
//       [
//         <div>
//           <input
//             value={title}
//             onChange={this.handleTitleChange('title')}
//             onBlur={this.updateDocument()}
//             type='title'
//             id='title'
//             name='title'
//           />
//         </div>,
//         <Popup trigger={<button className="button"> Open Modal </button>} modal>
//           {close => (
//             this.viewUserAvaliable(close)
//           )}
//         </Popup>,
//         <Chat key="0" id={this.state.id}/>,
//         <AceEditor
//         ref="aceEditor"
//         key="1"
//         mode="javascript"
//         theme="monokai"
//         name="editor"
//         onLoad={this.onLoad}
//         onChange={this.onChange}
//         onCursorChange={this.onCursorChange}
//         fontSize={14}
//         showPrintMargin={false}
//         showGutter={true}
//         highlightActiveLine={true}
//         height={height}
//         width={width}
//         debounceChangePeriod={1000}
//         editorProps={{ $blockScrolling: Infinity }}
//         setOptions={{
//           enableBasicAutocompletion: true,
//           enableLiveAutocompletion: true,
//           enableSnippets: false,
//           showLineNumbers: true,
//           tabSize: 2,
//         }}/>
//       ]
//     );
//   }
// }
//
//
// export default () => (
//   <Popup trigger={<button> Trigger</button>} position="right center">
//     <div>Popup content here !!</div>
//   </Popup>
// );
