import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { UserDocuments } from '../api/userDoc';
import { Documents } from '../api/documents';

export class LandingPage extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      documents: []
    };

    this.createDocument = this.createDocument.bind(this);
  }

  componentDidMount () {
    var currentUser = Meteor.userId();
    Tracker.autorun(() => {
      let data = Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch()
      if (data) {
        console.log(data)
        this.setState({documents: data, loading: false});
      }
    });
  }

  createDocument() {
    console.log("am i in createDocument")
    var currentUser = Meteor.userId();
    Documents.insert({
      title: "Untitled Document",
      createdAt: new Date(), // current time
      createdBy: currentUser
    }, function(error,results){
      if(error) {
        console.log("Documents Insert Faild: ",error.reason);
      } else {
        UserDocuments.insert({
          userId: currentUser,
          docId: results
        }, function(error, results){
          if(error) {
            console.log("UserDocuments Insert Faild: ",error.reason);
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
