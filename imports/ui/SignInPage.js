import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class SignInPage extends Component {
  constructor (props) {

    super(props);

    console.log("signin ctor",props);
    let prevUrlString = "";
    if(this.props.location.state) {
      prevUrlString = this.props.location.state.from.pathname;
    }
    this.state = {
      email: "",
      password: "",
      previousURl: prevUrlString
    };
    this.createToken = this.createToken.bind(this);

  }

  handleChange (name) {
    return event => {
      const {currentTarget} = event;
      this.setState({[name]: currentTarget.value});
    };
  }

  createToken (event) {
    const {email, password, previousURl} = this.state;
    const propsHistory = this.props.history;

    event.preventDefault();
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
          console.log(error.reason);
      } else {
        console.log ("propsHistory in createToken", previousUrl)
        propsHistory.goBack();

          // if (previousURl !== "" || previousURl != null) {
          //   // console.log("In SignInpage")
          //   console.log(previousURl)
          //     // window.location.href = Meteor.absoluteUrl(previousURl);
          // }
      }
    });
  }

  render () {
    const {email, password} = this.state;
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
            <input type='submit' value='Sign In'/>
          </div>
        </form>
        <Link to={`/register`}> Register </Link>
      </main>
    )
  }
}
