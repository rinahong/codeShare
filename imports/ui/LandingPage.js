import { UserDocuments } from '../api/UserDoc.js';
import { Documents } from '../api/Documents.js';

Template.createDocument.events({
  'submit form': function(event){
    event.preventDefault();
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
});

Template.docLists.helpers({
    'list': function(){
        var currentUser = Meteor.userId();
        return Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}});
    }
});
