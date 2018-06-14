import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Editor from '../imports/ui/Editor.js';
// import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js';

import {NavBar} from '../imports/ui/NavBar';
import {SignIn} from '../imports/ui/SignIn';
import {LandingPage} from '../imports/ui/LandingPage';
import {Register} from '../imports/ui/Register';

Meteor.startup(() => {
  console.log(Meteor.userId());
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
            <Route path="/users/:id/" component={LandingPage}/>
            <Route path="/register" component={Register}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
