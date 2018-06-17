import React, {Component} from 'react';
import { UserDocuments } from '../api/userDoc.js';
import { Documents } from '../api/documents.js';

class LandingPage2 extends Component{





  render(){

    return (
      <div>
        heyo
      </div>
    );
  }
}

export default withStyles(styles)(LandingPage2);


// import { UserDocuments } from '../api/userDoc.js';
// import { Documents } from '../api/documents.js';

// Template.createDocument.events({
//   'submit form': function(event){
//     event.preventDefault();
//     var currentUser = Meteor.userId();
//     Documents.insert({
//       title: "Untitled Document",
//       createdAt: new Date(), // current time
//       createdBy: currentUser
//     }, function(error,results){
//       if(error) {
//         console.log("Documents Insert Failed: ",error.reason);
//       } else {
//         UserDocuments.insert({
//           userId: currentUser,
//           docId: results
//         }, function(error, results){
//           if(error) {
//             console.log("UserDocuments Insert Failed: ",error.reason);
//           } else {
//             console.log("No error!")
//           }
//         })
//       }
//     });
//   }
// });

// Template.docLists.helpers({
//     'list': function(){
//         var currentUser = Meteor.userId();
//         return Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}});
//     }
// });
