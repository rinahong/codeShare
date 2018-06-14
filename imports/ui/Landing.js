import React from 'react';
import { Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor'
import InsetList from '../imports/ui/InsetList';

class Landing extends Component {

  render() {

    // check is user is logged in; if not, redirect to login page
    if (Meteor.userId() == null) {
      return (
        <Redirect
            to={{
              pathname: "/",
              state: { from: this.props.location }
            }}
          />
        )
    }

    return (
      <div>
        <InsetList />
      </div>

      
    );
  }
}