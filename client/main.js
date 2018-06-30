import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import NavBar from '../imports/ui/NavBar';
import { SignInPage } from '../imports/ui/SignInPage';
import { RegisterPage } from '../imports/ui/RegisterPage';
import { Editor } from '../imports/ui/Editor.js';
import { LandingPage } from '../imports/ui/LandingPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#00578e',
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
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <div class="row">
          <NavBar theme={theme} onSignOut={() => Meteor.logout(function (error) {
            console.log("Am I even in logout?")
            if (!error) {
              window.location.href = Meteor.absoluteUrl('/signin');
              console.log("Signout successfully, but why not redirect???")
            } else {
              console.log("why error?", error.reason)
            }
          })} >
            <Switch>
              <Route path="/signin" component={SignInPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/me/documents" component={LandingPage} theme={theme} />
              <Route path="/documents/:id" component={Editor} />
            </Switch>


           {/* If logged in, redirect to document, otherwise to signinpage */}

              { Meteor.userId() ? ([  // Should be wrapped in the array
                    <main>
                    </main>
                  ]) : (
                      <main>
                        <Route path="/" render={ () => <Redirect to="/signin" component={SignInPage}/> } />
                      </main>
                    )}


          </NavBar>
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
    , document.getElementById('render-target'));
});
