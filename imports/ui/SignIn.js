import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export class SignIn extends Component{

  componentDidMount() {
      this.view = Blaze.render(Template.login,
      ReactDOM.findDOMNode(this.container));
  }
  componentWillUnmount(){
      Blaze.remove(this.view);
  }

  render () {
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

            // Go back to previous page
          }
      });
    }
});
