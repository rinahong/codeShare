import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';

export class SignIn extends Component{

    

  componentDidMount() {
      this.view = Blaze.render(Template.LoginTemplate,
      ReactDOM.findDOMNode(this.container));
  }


  componentWillUnmount(){
      Blaze.remove(this.view);
  }

  render () {

    if (Meteor.userId() != null) {
        return ( <Redirect to={{ pathname: "/home" }} />)
      }
      return <span ref={(ref) => this.container = ref} />
    
  }
}

Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
              console.log(error.reason);
          } else {
            window.location.href = Meteor.absoluteUrl('/me/documents');
            // Below only render template not redirecting to the '/me/documents'
            // Router.go('/me/documents');
          }
      });
    }
});
