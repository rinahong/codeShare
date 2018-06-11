import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from '../imports/ui/App.js';
import Editor from '../imports/ui/Editor.js';
import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js';

Meteor.startup(() => {
  console.log(Meteor.userId());
  render(
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/document/:id/" component={Editor}/>
            <Route path="/" component={AccountsUIWrapper}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
