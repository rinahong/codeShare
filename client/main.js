import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Editor from '../imports/ui/Editor.js';
import Chat from '../imports/ui/Chat.js';

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
            <Route path="/chat/" component={Chat}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
