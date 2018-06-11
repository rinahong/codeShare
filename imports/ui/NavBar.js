import React from 'react';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor'

function NavBar (props) {
  const {onSignOut = () => {}} = props;
  return (
    <nav
      style={{
        padding: '10px',
        display: 'flex',
      }}
    >
      <Link style={{marginRight: '20px'}} to="/document/1">Editor </Link>

      {
        Meteor.userId() ? ([  // Should be wrapped in the array
          <span key='1' style={{marginRight: '20px'}}>Hello, {Meteor.userId()}</span>,
          <a key='2' href="/" onClick={onSignOut}>Sign Out </a>
        ]) : (
          <Link style={{marginRight: '20px'}} to="/signin">Sign In</Link>
        )
      }
    </nav>
  );
}

export {NavBar};
