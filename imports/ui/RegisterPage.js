import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


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



export class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      password_confirmation: ""
    };

    this.registerUser = this.registerUser.bind(this);
  }

  handleChange(name) {
    return event => {
      const { currentTarget } = event;
      this.setState({ [name]: currentTarget.value });
    };
  }


  registerUser(event) {
    event.preventDefault();
    const {email, username, password, password_confirmation} = this.state;
    const propsHistory = this.props.history;

    if(password === password_confirmation) {
      Accounts.createUser({
        email: email,
        username: username,
        password: password,
      }, function (error) {
        if (error) {
          console.log("Accounts.createUser Failed: ", error.reason);
        } else {
          propsHistory.push('/me/documents');
        }
      });
    } else {
      console.log("Password do not match.");
    }
  }

  render() {
    const { email, username, password, password_confirmation } = this.state;
    return (
      <main
        className="SignInPage"
        style={{
          padding: '0 20px'
        }}
      >
      <Paper style={style.paper}>
        <h2 style={style.title}>Register</h2>
        <form onSubmit={this.registerUser}>
          <div>
          <TextField
                id="email"
                label="Email"
                className="textField"
                value={email}
                onChange={this.handleChange('email')}
                margin="normal"
              />
            {/* <label htmlFor='email'>Email</label> <br />
            <input
              value={email}
              onChange={this.handleChange('email')}
              type='email'
              id='email'
              name='email'
            /> */}
          </div>

          <div>
            {/* <label htmlFor='username'>Username</label> <br /> */}
            {/* <input
              value={username}
              onChange={this.handleChange('username')}
              type='username'
              id='username'
              name='username'
            /> */}
            <TextField
                id="username"
                label="Username"
                className="textField"
                value={username}
                onChange={this.handleChange('username')}
                margin="normal"
              />
          </div>

          <div>
            {/* <label htmlFor='password'>Password</label> <br />
            <input
              value={password}
              onChange={this.handleChange('password')}
              type='password'
              id='password'
              name='password'
            /> */}
            <TextField
                id="password"
                label="Password"
                className="textField"
                value={password}
                type="password"
                onChange={this.handleChange('password')}
                margin="normal"
              />
          </div>

          <div>
            {/* <label htmlFor='password_confirmation'>Password Confirmation</label> <br />
            <input
              value={password_confirmation}
              onChange={this.handleChange('password_confirmation')}
              type='password'
              id='password_confirmation'
              name='password_confirmation'
            /> */}
          </div>
          <TextField
                id="password_confirmation"
                label="Confirm Password"
                className="textField"
                type='password'
                value={password_confirmation}
                onChange={this.handleChange('password_confirmation')}
                margin="normal"
              />
          <div>
            {/* <input type='submit' value='Register!' /> */}
            <Button size="large" style={style.button} type='submit'>
                REGISTER
              </Button>
          </div>
        </form>
      </Paper>
      </main>
    )
  }
}
