import React, { Component } from 'react';

export class RegisterPage extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      password: "",
      password_confirmation: ""
    };

    this.registerUser = this.registerUser.bind(this);
  }

  handleChange (name) {
    return event => {
      const {currentTarget} = event;
      this.setState({[name]: currentTarget.value});
    };
  }


  registerUser (event) {
    event.preventDefault();
    const {email, username, password, password_confirmation} = this.state;
    if(password === password_confirmation) {
      Accounts.createUser({
          email: email,
          password: password,
          profile: {
            username: username
          }
      },function(error) {
        if(error) {
          console.log("Accounts.createUser Failed: ",error.reason);
        } else {
          window.location.href = Meteor.absoluteUrl('/me/documents');
        }
      });
    } else {
      console.log("Password do not match.");
    }
  }

  render () {
    const {email, username,password, password_confirmation} = this.state;
    return (
      <main
        className="SignInPage"
        style={{
          padding: '0 20px'
        }}
      >
        <h2>Register</h2>
        <form onSubmit={this.registerUser}>
          <div>
            <label htmlFor='email'>Email</label> <br />
            <input
              value={email}
              onChange={this.handleChange('email')}
              type='email'
              id='email'
              name='email'
            />
          </div>

          <div>
            <label htmlFor='username'>Username</label> <br />
            <input
              value={username}
              onChange={this.handleChange('username')}
              type='username'
              id='username'
              name='username'
            />
          </div>

          <div>
            <label htmlFor='password'>Password</label> <br />
            <input
              value={password}
              onChange={this.handleChange('password')}
              type='password'
              id='password'
              name='password'
            />
          </div>

          <div>
            <label htmlFor='password_confirmation'>Password Confirmation</label> <br />
            <input
              value={password_confirmation}
              onChange={this.handleChange('password_confirmation')}
              type='password'
              id='password_confirmation'
              name='password_confirmation'
            />
          </div>

          <div>
            <input type='submit' value='Register!'/>
          </div>
        </form>

      </main>
    )
  }
}
