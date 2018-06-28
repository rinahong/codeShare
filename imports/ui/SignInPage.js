import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


const style = {
  button: {
    background: '#00578e',
    borderRadius: 3,
    color: 'white',
    width: '30%',
    marginTop: '30px'
  },

  registerText: {
    color: 'primary',
    fontFamily: 'Roboto'
  },
  paper: {
    textAlign: 'center',
    paddingBottom: '20px',
  },
  title: {
    paddingTop: '20px',
    fontFamily: 'Roboto'
  }
};

export class SignInPage extends Component {


  constructor(props) {


    super(props);

    let prevUrlString = "";
    if (this.props.location.state) {
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

  createToken(event) {
    const { email, password, previousURl = "" } = this.state;
    const propsHistory = this.props.history;
    event.preventDefault();

    Meteor.loginWithPassword(email, password, function (error) {
      if (error) {
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
          padding: '0 20px',
        }}
      >
        <Paper style={style.paper}>
          <h2 style={style.title}>Sign In</h2>
          <form onSubmit={this.createToken}>


            <div>
              <TextField
                id="email"
                label="Email"
                className="textField"
                value={email}
                onChange={this.handleChange('email')}
                margin="normal"
              />
            </div>

            <div>
              <TextField
                id="password"
                label="Password"
                className="textField"
                value={password}
                onChange={this.handleChange('password')}
                margin="normal"
                type="password"
              />


            </div>

            <div>
              {/* <input type='submit' value='Sign In' /> */}
              <Button size="large" style={style.button} type='submit'>
                LOGIN
              </Button>
            </div>
          </form>
          <p style={style.registerText}> Don't have an account?
            <Link to={`/register`}> Register </Link>
          </p>
        </Paper>
      </main>
    )
  }
}
