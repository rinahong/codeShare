import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { UserDocuments } from '../api/userDoc';
import { DocumentContents } from '../api/documentContents';

export class LandingPage extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      documents: []
    };

    this.createDocument = this.createDocument.bind(this);
  }

  // Option 1:
  // componentDidMount () {
  //   var currentUser = Meteor.userId();
  //   Tracker.autorun(() => {
  //     let data = DocumentContents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch()
  //     if (data) {
  //       console.log(data)
  //       this.setState({documents: data, loading: false});
  //     }
  //   });
  // }

  // Option 2:
  //Rina prefers option 2. Render page only once unlike option 1.
  //Rina will talk about option 1 issue tomorrow meeting.
  componentDidMount () {
    var currentUser = Meteor.userId();
    Meteor.call('getDocuments', currentUser, (error, result) => {
      if(error) {
        console.log("There was an error to retreive DocumentContent list");
      } else {
        this.setState({documents: result, loading: false});
      }
    });
  }

  createDocument() {
    var currentUser = Meteor.userId();

    DocumentContents.insert({
      title: "Untitled Document",
      createdAt: new Date(), // current time
      createdBy: currentUser
    }, function(error,results){
      if(error) {
        console.log("Documents Insert Failed: ",error.reason);
      } else {
        UserDocuments.insert({
          userId: currentUser,
          docId: results
        }, function(error, results){
          if(error) {
            console.log("UserDocuments Insert Failed: ",error.reason);
          } else {
            console.log("No error!")
          }
        })
      }
    });
  }

  render () {
    const {loading} = this.state;

    if (loading) {
      return (
        <main
          className="LandingPage"
          style={{padding: '0  20px'}}
        >
          <h3>Loading documents...</h3>
        </main>
      )
    }

    return (
      <main
        className="LandingPage"
        style={{padding: '0  20px'}}
      >
        <h2>Create Document</h2>
        <form onSubmit={this.createDocument}>
          <div>
            <input type='submit' value='Create New Document'/>
          </div>
        </form>


        <h2>Documents</h2>
        <ul style={{paddingLeft: '10px'}}>
          {
            this.state.documents.map(doc => (
              <li key={doc._id}>
                <Link to={`/documents/${doc._id}`}>
                  {JSON.stringify(doc.title) + "---" + JSON.stringify(doc._id)}
                </Link>
              </li>
            ))
          }
        </ul>
      </main>
    );
  }
}
