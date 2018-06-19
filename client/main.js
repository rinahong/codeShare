import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NavBar from '../imports/api/NavBar';
import { SignInPage } from '../imports/ui/SignInPage';
import { RegisterPage } from '../imports/ui/RegisterPage';
import { Editor } from '../imports/ui/Editor.js';
import { Landing } from '../imports/ui/Landing';
import { LandingPage } from '../imports/ui/LandingPage';

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

          <NavBar onSignOut={()=> Meteor.logout(function(error){
            console.log("Am I even in logout?")
            if(!error) {
              window.location.href = Meteor.absoluteUrl('/signin');
              console.log("Signout successfully, but why not redirect???")
            }else {
              console.log("why error?", error.reason)
            }
          })}/>
          <Switch>

            <Route path="/signin" component={SignInPage}/>
            <Route path="/register" component={RegisterPage}/>
            <Route path="/home" component={Landing}/>
            <Route path="/me/documents" component={LandingPage}/>
            <Route path="/documents/:id" component={Editor}/>
          </Switch>
        </div>
      </BrowserRouter>
    , document.getElementById('render-target'));
});
