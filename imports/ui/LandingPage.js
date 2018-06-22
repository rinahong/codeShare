import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UserDocuments } from '../api/userDoc';
import { DocumentContents } from '../api/documentContents';

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
    var currentUser = Meteor.userId();
    Tracker.autorun(() => {
      let data = DocumentContents.find({ createdBy: currentUser }, { sort: { createdAt: -1 } }).fetch()
      if (data) {
        console.log(data)
        this.setState({ documents: data, loading: false });
      }
    });
  }

  createDocument() {
    console.log("am i in createDocument")
    var currentUser = Meteor.userId();

    DocumentContents.insert({
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
        <Button variant="contained" color="secondary" onClick={this.createDocument} style={{ padding: '0  20px', color: 'white' }}>
            New Document
        </Button>

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
              </ListItem>
            ))
          }
        </List>
      </main>
    );
  }
}

