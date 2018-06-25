import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UserDocuments } from '../api/userDoc';
import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Button } from '@material-ui/core';

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
      <main
        className="LandingPage"
        style={{ padding: '0  20px' }}
      >

        <h2>Create Document</h2>
        <form onSubmit={this.createDocument}>
          <div>
            <Button variant="contained" color="secondary" type="submit" style={{ padding: '0  20px', color: 'white' }}>
              New Document
            </Button>
          </div>
        </form>


        <h2>Documents</h2>

        <List style={{ paddingLeft: '10px', width: '50%', backgroundColor: 'paper' }} subheader={<ListSubheader component="div">Documents</ListSubheader>}>
          {
            this.state.documents.map(doc => (
              <ListItem button key={doc._id}>
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <Link to={`/documents/${doc._id}`}>
                  <ListItemText inset primary={JSON.stringify(doc.title) + "---" + JSON.stringify(doc._id)} />

                </Link>
                <button onClick={this.deleteDocument(doc._id)}>Delete</button>
              </ListItem>
            ))
          }
        </List>
      </main>
    );
  }
}
