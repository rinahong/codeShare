import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UserDocuments } from '../api/userDoc';
import { Documents } from '../api/documents.js';

import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';

import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';


export class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      documents: []
    };

    this.createDocument = this.createDocument.bind(this);
  }

  componentDidMount() {
    const currentUser = Meteor.userId();
    if (currentUser) {
      Meteor.call('getDocuments', currentUser, (error, result) => {
        if (error) {
          console.log("There was an error to retreive Document list");
        } else {
          this.setState({ documents: result, loading: false });
        }
      });
    } else {
      this.props.history.push({
        pathname: "/signin",
        state: { from: this.props.location }
      })
    }
  }

  createDocument() {
    var currentUser = Meteor.userId();

    Documents.insert({
      title: "Untitled Document",
      createdAt: new Date(), // current time
      createdBy: currentUser
    }, function (error, results) {
      if (error) {
        console.log("Documents Insert Failed: ", error.reason);
      } else {
        UserDocuments.insert({
          userId: currentUser,
          docId: results
        }, function (error, results) {
          if (error) {
            console.log("UserDocuments Insert Failed: ", error.reason);
          } else {
            console.log("No error!")
            window.location.reload()

          }
        })
      }
    });
  }

  deleteDocument(documentId) {
    return () => {
      const { documents } = this.state;
      // Meteor.method "deleteDocument" will remove Document from mongoDB.
      Meteor.call('deleteDocument', documentId, (error, result) => {
        if (error) {
          console.log("There was an error to retreive Document list");
        } else {
          // Remove the document from the state, so that, remove the document from the LandingPage.
          this.setState({
            documents: documents.filter(doc => doc._id !== documentId)
          });
        }
      });


    }
  }


  render() {
    const { loading } = this.state;
    const DATE_OPTIONS = { year: 'numeric', month: 'short' , day: 'numeric', hour: 'numeric', minute: 'numeric' };
    if (loading) {
      return (
        <main
          className="LandingPage"
          style={{ padding: '0  20px' }}
        >
          <h3>Loading documents...</h3>
        </main>
      )
    }

    return (
      <div
        className="LandingPage"
        style={{ padding: '0  20px', textAlign: 'center' }}
      >
        <img src="/codeShareLogo.png" alt="logo" style={{ width: '30%', height: '30%', paddingTop: '30px', textAlign: 'center' }} />

        <div className="widget-container" style={{ width: '10%', paddingLeft: '20px', paddingBottom: '20px' }}>
          <Button onClick={this.createDocument} variant="fab" color="secondary" aria-label="add" type="submit" style={{ color: 'white' }}>
            <AddIcon />
          </Button>
        </div>

        <List style={{ width: '85%', backgroundColor: 'paper', textAlign: 'center' }} subheader={<ListSubheader style={{ textAlign: 'left' }}component="div">Documents</ListSubheader>}>
          {
            this.state.documents.map(doc => (
              // <ListItem button key={doc._id}>
              //   <ListItemIcon>
              //   </ListItemIcon>
              //   <Link to={`/documents/${doc._id}`}>
              //     <ListItemText inset primary={JSON.stringify(doc.title) + "---" + JSON.stringify(doc._id)} />

              //   </Link>
              //   <ListItemSecondaryAction onClick={this.deleteDocument(doc._id)}>
              //     <IconButton aria-label="Comments">
              //       <CommentIcon />
              //     </IconButton>
              //   </ListItemSecondaryAction>
              // </ListItem>

              <ListItem key={doc._id}>
                <ListItemAvatar>
                  <Avatar>
                    <InsertDriveFileIcon />
                  </Avatar>
                </ListItemAvatar>

                  <Link to={`/documents/${doc._id}`}>
                      <ListItemText inset primary={JSON.stringify(doc.title) + "---" + JSON.stringify(doc._id)}  secondary={"Created: "+(doc.createdAt.toLocaleDateString('en-US', DATE_OPTIONS))} />
                  </Link>                  
                <ListItemSecondaryAction onClick={this.deleteDocument(doc._id)}>

                  <IconButton aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          }
        </List>


      </div>

    );
  }
}
