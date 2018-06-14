import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';

export class Register extends Component{

  componentDidMount() {
      this.view = Blaze.render(Template.register,
      ReactDOM.findDOMNode(this.container));
  }
  componentWillUnmount(){
      Blaze.remove(this.view);
  }

  render () {
      return <span ref={(ref) => this.container = ref} />
  }
}

Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        var confirmPassword = $('[name=password-confirm]').val();
        if(password === confirmPassword) {
          Accounts.createUser({
              email: email,
              password: password,
              profile: {
                username: username
              }
          });
        } else {
          console.log("Password do not match.");
        }

    }
});
