import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Editor from '../imports/ui/Editor.js';
import { Landing } from '../imports/ui/Landing';
import { createMuiTheme } from '@material-ui/core/styles';


// import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js';

import {SignIn} from '../imports/ui/SignIn';
import NavBar2 from '../imports/ui/NavBar2';
// import {LandingPage} from '../imports/ui/LandingPage';
import {Register} from '../imports/ui/Register';
// import '../imports/api/Router';
// import InsetList from '../imports/ui/InsetList';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      main: '#a8b324',
      // dark: will be calculated from palette.secondary.main,
    },
    // error: will use the default color
  },
});

Meteor.startup(() => {
  console.log(Meteor.userId());

  render(
      <BrowserRouter>
        <div>

          <NavBar2 onSignOut={()=> Meteor.logout(function(error){
            if(!error) {
              window.location.href = Meteor.absoluteUrl('/signin');
              // Router.go('/signin');
            }
          })}/>
          <Switch>
            <Route path="/documents/:id/" component={Editor}/>
             <Route path="/signin/" component={SignIn}/>
            <Route path="/home/" component={Landing}/>
            {/* <Route path="/users/:id/" component={LandingPage}/> */}
            {/* <Route exact path="/" component={SignIn}/> */}
            {/* <Route path="/signin/" component={SignIn}/> */}
            <Route path="/register" component={Register}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
