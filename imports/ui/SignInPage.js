import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class SignInPage extends Component {
  constructor(props) {

    super(props);

    let prevUrlString = "";
    if(this.props.location.state) {
      console.log(this.props)
      prevUrlString = this.props.location.state.from.pathname;
    }
    this.state = {
      email: "",
      password: "",
      previousURl: prevUrlString
    };
    this.createToken = this.createToken.bind(this);

  }

  handleChange(name) {
    return event => {
      const { currentTarget } = event;
      this.setState({ [name]: currentTarget.value });
    };
  }

  createToken (event) {
    const {email, password, previousURl = ""} = this.state;
    const propsHistory = this.props.history;
    event.preventDefault();
    
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
          console.log(error.reason);
      } else {

        //If previousURl is not empty, redirect to previous page.
        if (previousURl != "") {
            console.log("PreviouseURL is not empty:", previousURl)
            propsHistory.push(previousURl);
        } else { //Else, always go to my document list page.
          console.log("PreviouseURL is empty string.")
          propsHistory.push("/me/documents");
        }
      }

    });
  }

  render() {
    const { email, password } = this.state;
    return (
      <main
        className="SignInPage"
        style={{
          padding: '0 20px'
        }}
      >
        <h2>Sign In</h2>
        <form onSubmit={this.createToken}>
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
            <input type='submit' value='Sign In' />
          </div>
        </form>
        <Link to={`/register`}> Register </Link>
      </main>
    )
  }
}
