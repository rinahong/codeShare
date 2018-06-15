import { UserDocuments } from '../api/userDoc.js';
import { Documents } from '../api/documents.js';

Template.createDocument.events({
  'submit form': function(event){
    event.preventDefault();
    var currentUser = Meteor.userId();
    Documents.insert({
      id: "3",
      value: "",
      createdAt: new Date(), // current time
      createdBy: currentUser
    }, function(error){
      if(error) {
        console.log(error.reason);
      } else {
        UserDocuments.insert({
          userId: currentUser,
          docId: 3
        }, function(error, results){
          if(error) {
            console.log(error.reason);
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
        return Documents.find({}, {sort: {name: 1}});
    }
});
