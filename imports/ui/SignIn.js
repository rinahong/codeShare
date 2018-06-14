// import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
//
// export class SignIn extends Component{
//
//   componentDidMount() {
//       this.view = Blaze.render(Template.LoginTemplate,
//       ReactDOM.findDOMNode(this.container));
//   }
//
//
//   componentWillUnmount(){
//       Blaze.remove(this.view);
//   }
//
//   render () {
//       return <span ref={(ref) => this.container = ref} />
//   }
// }


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {browserHistory} from 'react-router';

export class SignIn extends Component {
  constructor (props) {
    super(props);

    this.state = {
      email: "",
      password: ""
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
    event.preventDefault();
    const {email, password} = this.state;
    Meteor.loginWithPassword(email, password);
    setTimeout(()=>{
      if (this.props.location.state) {
          console.log(this.props.location.state.from.pathname);
          this.props.history.push(this.props.location.state.from.pathname);
      } else {
        this.props.history.push('/');
      }
    },1000)
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
