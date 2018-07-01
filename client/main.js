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



const PrivateRoute = ({ component, redirectTo, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return Meteor.userId() ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: { from: routeProps.location }
          }} />
        );
    }} />
  );
};

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}
// { Meteor.userId() ? ([  // Should be wrapped in the array
//   <main>
//   </main>
// ]) : (
//     <main>
//       <Route path="/" render={ () => <Redirect to="/signin" component={SignInPage}/> } />
//     </main>
//   )}


Meteor.startup(() => {
  const currentUser = Meteor.userId();
  console.log(currentUser);
  render(
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="row">
          <Switch>
            <Route path="/signin" component={SignInPage} />
            <Route path="/register" component={RegisterPage} />
              <PrivateRoute path="/documents/:id" component={Editor} redirectTo="/signin" />
              <PrivateRoute path="/me/documents" component={LandingPage} redirectTo="/signin" />
              <PrivateRoute path="*" redirectTo="/signin" />
          </Switch>
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
    , document.getElementById('render-target'));
});
