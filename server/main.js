import { Meteor } from 'meteor/meteor';

import '../imports/api/userDoc';
import '../imports/api/messages';
import { DocumentContents } from '../imports/api/documentContents.js';

Meteor.startup(() => {
  return Meteor.methods({
    getDocuments: function(currentUser) {
      return DocumentContents.find({ createdBy: currentUser }, {sort: {createdAt: -1}}).fetch();
    }

  });
});
