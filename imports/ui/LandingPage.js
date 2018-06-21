import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UserDocuments } from '../api/userDoc';
import { Documents } from '../api/documents.js';
import { DocumentContents } from '../api/documentContents.js';

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
  //     let data = Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch()
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
    const currentUser = Meteor.userId();
    if(currentUser) {
      Meteor.call('getDocuments', currentUser, (error, result) => {
        if(error) {
          console.log("There was an error to retreive Document list");
        } else {
          this.setState({documents: result, loading: false});
        }
      });
    } else {
      console.log("landing page this.props", this.props)
      this.props.history.push("/signin")
    }
  }

  createDocument() {
    var currentUser = Meteor.userId();

    Documents.insert({
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

  deleteDocument (documentId) {
    return () => {
      const {documents} = this.state;
      // Meteor.method "deleteDocument" will remove Document from mongoDB.
      Meteor.call('deleteDocument', documentId, (error, result) => {
        if(error) {
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
                <button onClick={this.deleteDocument(doc._id)}>Delete</button>
              </li>
            ))
          }
        </ul>
      </main>
    );
  }
}
