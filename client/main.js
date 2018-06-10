import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from '../imports/ui/App.js';

Meteor.startup(() => {
  render(
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/document/:id/" component={App}/>
            <Route path="/" component={App}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
