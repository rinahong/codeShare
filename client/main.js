import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Editor from '../imports/ui/Editor.js';

import {NavBar} from '../imports/ui/NavBar';
import {SignIn} from '../imports/ui/SignIn';
import {LandingPage} from '../imports/ui/LandingPage';
import {Register} from '../imports/ui/Register';
import '../imports/api/Router';

Meteor.startup(() => {
  console.log(Meteor.userId());
  console.log();
  render(
      <BrowserRouter>
        <div>
          <NavBar onSignOut={()=> Meteor.logout(function(error){
            if(!error) {
              window.location.href = Meteor.absoluteUrl('/signin');
              // Router.go('/signin');
            }
          })}/>
          <Switch>
            <Route path="/documents/:id/" component={Editor}/>
            {/* <Route path="/users/:id/" component={LandingPage}/> */}
            {/* <Route exact path="/" component={SignIn}/> */}
            {/* <Route path="/signin/" component={SignIn}/> */}
            {/* <Route path="/register" component={Register}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
