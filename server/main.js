import { Meteor } from 'meteor/meteor';

import '../imports/api/userDoc';
import '../imports/api/messages';
import { Documents } from '../imports/api/documents.js';
import { DocumentContents } from '../imports/api/documentContents.js';

Meteor.startup(() => {
  return Meteor.methods({
    getDocuments: function(currentUser) {
      return Documents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch();
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
      Documents.update({ _id: docId },
        {
          title: docTitle
        });
    }
  });
});
