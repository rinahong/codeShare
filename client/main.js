import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Editor from '../imports/ui/Editor.js';
import { Landing } from '../imports/ui/Landing';

// import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js';

import {SignIn} from '../imports/ui/SignIn';
import NavBar2 from '../imports/ui/NavBar2';
// import InsetList from '../imports/ui/InsetList';


Meteor.startup(() => {

  // console.log(Meteor.userId());
  console.log();
  render(
      <BrowserRouter>
        <div>
          <NavBar2 onSignOut={()=> Meteor.logout(function(err){
            console.log(err);
          })}  />
          <Switch>
            <Route path="/document/:id/" component={Editor}/>
            <Route path="/signin/" component={SignIn}/>
            <Route path="/home/" component={Landing}/>

            {/* <Route path="/" component={AccountsUIWrapper}/> */}
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
