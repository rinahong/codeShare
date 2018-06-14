import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Editor from '../imports/ui/Editor.js';

import {NavBar} from '../imports/ui/NavBar';
import {SignIn} from '../imports/ui/SignIn';

Meteor.startup(() => {
  // console.log(Meteor.userId());
  console.log();
  render(
      <BrowserRouter>
        <div>
          <NavBar onSignOut={()=> Meteor.logout(function(err){
            console.log(err);
          })}/>
          <Switch>
            <Route path="/document/:id/" component={Editor}/>
            <Route path="/signin/" component={SignIn}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
