import { Meteor } from 'meteor/meteor';
import '../imports/api/messages';
import { Documents } from '../imports/api/documents.js';
import { DocumentContents } from '../imports/api/documentContents.js';
import { UserDocuments } from '../imports/api/userDoc';

Meteor.startup(() => {
  return (
    Meteor.methods({
      getAllUsers: function() {
        return Meteor.users.find({}).fetch();
      },

      quickUserSearchInUserDoc: function(currentUser, docId) {
        return UserDocuments.find({ userId: currentUser, docId: docId }).fetch();
      },

      getAllUsersByDocument: function(docId) {
        return UserDocuments.find({ docId: docId }).fetch();
      },

      getAllSharedDocumentsByOthers: function(userId) {
        return UserDocuments.find({ userId: userId, createdBy: { $ne: userId } }).fetch();
      },

      getDocumentsByUser: function(currentUser) {
        return Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch();
      },

      getDocumentsByDocIds: function(docIdArray) {
        return Documents.find({ _id: { "$in": docIdArray } }, {sort: {createdAt: -1}}).fetch();
      },

      // Delete the document's dependents (document contents) and itself.
      deleteDocument: function(docId) {
        return DocumentContents.remove({docId: docId}, function() {
                Documents.remove(docId);
              });
      },

      findDocument: function(docId) {
        return Documents.findOne({ _id: docId });
      },

      updateTitle(docId, docTitle) {
        Documents.update({ _id: docId }, {$set: {title: docTitle}});
      },

      updateMode(docId, docMode) {
        Documents.update({ _id: docId }, {$set: {mode: docMode}});
      },

      upsertUserDocument(userId, docId, documentCreatedBy) {
        UserDocuments.upsert({
            // Selector
            userId: userId,
            docId: docId,
            createdBy: documentCreatedBy

        }, {
            // Modifier
            $set: {
              userId: userId,
              docId: docId,
              createdBy: documentCreatedBy
            }
        })
      }

    }) //End of Meteor.methods
  ) //End of return

});
